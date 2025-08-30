export function calculateKeywordScore(userAnswer, expectedPoints) {
  const answerWords = userAnswer.toLowerCase().split(/\s+/);
  let totalScore = 0;

  expectedPoints.forEach(point => {
    const pointWords = point.toLowerCase().split(/\s+/);
    const relevantWords = pointWords.filter(word => word.length > 3);
    
    const matchCount = relevantWords.filter(word => 
      answerWords.some(answerWord => answerWord.includes(word))
    ).length;

    totalScore += matchCount / relevantWords.length;
  });

  return totalScore / expectedPoints.length;
}

export function validateAnswerLength(answer) {
  return answer.trim().split(/\s+/).length >= 10;
}

export function extractCodeSnippets(answer) {
  const codeRegex = /```(?:javascript|js|typescript|ts)?\s*([\s\S]*?)```/g;
  const matches = [];
  let match;
  
  while ((match = codeRegex.exec(answer)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}

export function calculateReadingLevel(text) {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const characters = text.length;
  
  if (words === 0 || sentences === 0) return 0;
  
  const averageWordsPerSentence = words / sentences;
  const averageSyllablesPerWord = this.countSyllables(text) / words;
  
  return 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
}

export function countSyllables(text) {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;
  
  words.forEach(word => {
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    syllableCount += syllables ? syllables.length : 1;
  });
  
  return syllableCount;
}