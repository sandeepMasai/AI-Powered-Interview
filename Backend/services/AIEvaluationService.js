import OpenAIService from './OpenAIService.js';
import EvaluationCache from './EvaluationCache.js';
import { generateEvaluationPrompt } from '../utils/promptTemplates.js';
import { calculateKeywordScore } from '../utils/evaluationHelpers.js';

class AIEvaluationService {
  constructor() {
    this.cache = new EvaluationCache();
    this.openAIService = new OpenAIService();
  }

  async evaluateAnswer(request) {
    const { question, userAnswer, expectedPoints, topic } = request;

    // Check cache first
    const cacheKey = this.generateCacheKey(question, userAnswer);
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // Primary evaluation using LLM
      const llmResult = await this.evaluateWithLLM(request);
      
      // Secondary validation with keyword matching
      const keywordScore = calculateKeywordScore(userAnswer, expectedPoints);
      
      // Combine results with confidence weighting
      const finalScore = this.calculateFinalScore(llmResult.score, keywordScore);
      
      const result = {
        score: finalScore,
        feedback: llmResult.feedback,
        missedPoints: llmResult.missedPoints,
        suggestions: llmResult.suggestions,
        confidence: llmResult.confidence
      };

      // Cache the result
      await this.cache.set(cacheKey, result);
      
      return result;

    } catch (error) {
      // Fallback to keyword-based evaluation if LLM fails
      console.error('LLM evaluation failed, using fallback:', error);
      return this.fallbackEvaluation(userAnswer, expectedPoints);
    }
  }

  async evaluateWithLLM(request) {
    const prompt = generateEvaluationPrompt(
      request.question,
      request.userAnswer,
      request.expectedPoints,
      request.topic
    );

    const response = await this.openAIService.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    return this.parseLLMResponse(response.choices[0].message.content);
  }

  parseLLMResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        score: Math.min(10, Math.max(0, parsed.score)),
        feedback: parsed.feedback,
        missedPoints: parsed.missedPoints || [],
        suggestions: parsed.suggestions || [],
        confidence: parsed.confidence || 0.8
      };
    } catch (error) {
      throw new Error('Failed to parse LLM response');
    }
  }

  fallbackEvaluation(userAnswer, expectedPoints) {
    const score = calculateKeywordScore(userAnswer, expectedPoints);
    
    return {
      score: score * 10,
      feedback: "Evaluated using keyword matching (LLM unavailable)",
      missedPoints: this.findMissingPoints(userAnswer, expectedPoints),
      suggestions: ["Try to provide more detailed explanations with examples"],
      confidence: 0.6
    };
  }

  findMissingPoints(userAnswer, expectedPoints) {
    return expectedPoints.filter(point => 
      !point.toLowerCase().split(' ').some(word =>
        userAnswer.toLowerCase().includes(word.toLowerCase())
      )
    );
  }

  calculateFinalScore(llmScore, keywordScore) {
    return Math.round((llmScore * 0.7) + (keywordScore * 10 * 0.3));
  }

  generateCacheKey(question, answer) {
    return `${question.substring(0, 50)}_${answer.substring(0, 50)}`.replace(/\s+/g, '_');
  }
}

export default new AIEvaluationService();