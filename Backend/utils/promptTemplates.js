export function generateEvaluationPrompt(question, userAnswer, expectedPoints, topic) {
  return `
You are an expert technical interviewer evaluating a candidate's response.

TOPIC: ${topic}
QUESTION: "${question}"
EXPECTED KEY POINTS: ${JSON.stringify(expectedPoints)}
CANDIDATE'S ANSWER: "${userAnswer}"

Please evaluate the answer and provide:
1. Score (0-10) based on completeness and accuracy
2. Detailed feedback
3. Missed expected points (if any)
4. Specific suggestions for improvement
5. Confidence level (0-1)

Return JSON format only:
{
  "score": number,
  "feedback": string,
  "missedPoints": string[],
  "suggestions": string[],
  "confidence": number
}

Be strict but fair. Consider:
- Technical accuracy
- Completeness of explanation
- Examples provided
- Clarity of communication
- Relevance to question
`;
}

export function generateDsaFeedbackPrompt(problem, code, results) {
  return `
You are an expert programming interviewer. Analyze this code solution:

PROBLEM: ${problem.title}
DESCRIPTION: ${problem.description}
DIFFICULTY: ${problem.difficulty}

USER'S CODE:
${code}

TEST RESULTS:
${JSON.stringify(results, null, 2)}

Provide constructive feedback on:
1. Code correctness and edge cases
2. Time and space complexity
3. Code readability and style
4. Potential improvements
5. Best practices followed or violated

Return feedback in markdown format with specific examples.
`;
}