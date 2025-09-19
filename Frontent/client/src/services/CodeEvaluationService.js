
import axios from 'axios';

const CodeEvaluationService = {
  evaluateCode: async ({ code, language, functionName, testCases = [],  }) => {
    try {
      const results = [];
      let passedTestCases = 0;

      for (const testCase of testCases) {
        const fullCode = wrapCode(code, functionName, testCase.input);

        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: language || 'javascript',
          source: fullCode
        });

        const output = response.data?.output?.trim() || '';
        const expected = testCase.expectedOutput.trim();

        const passed = output === expected;

        results.push({
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: output,
          passed,
          error: passed ? null : output.includes('Error') ? output : null
        });

        if (passed) passedTestCases++;
      }

      const totalTestCases = testCases.length;
      const overallScore = Math.round((passedTestCases / totalTestCases) * 100);
      const feedback = overallScore >= 80
        ? 'Great job! Keep practicing!'
        : overallScore >= 50
        ? 'Good attempt. Try to optimize further.'
        : 'Needs improvement. Review the fundamental concepts and try again.';

      return {
        totalTestCases,
        passedTestCases,
        results,
        overallScore,
        feedback,
        executionSummary: {
          totalTime: 0,     // Optional: measure time using `Date.now()`
          totalMemory: 0,   // Optional
          averageTime: 0,
          averageMemory: 0
        }
      };
    } catch (error) {
      console.error('Code evaluation failed:', error);
      throw new Error('Code evaluation service error');
    }
  }
};

const wrapCode = (userCode, functionName, input) => {
  return `
${userCode}

console.log(${functionName}(${input}));
  `.trim();
};

export default CodeEvaluationService;
