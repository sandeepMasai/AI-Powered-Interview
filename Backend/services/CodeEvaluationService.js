import Judge0Service from './Judge0Service.js';
import { sanitizeCode, extractFunctionName } from '../utils/codeSanitizer.js';
import { generateTestCases } from '../utils/testCaseGenerator.js';

class CodeEvaluationService {
  async evaluateCode(request) {
    const { code, language, functionName, testCases, timeLimit = 5, memoryLimit = 128 } = request;
    
    try {
      // Sanitize and validate code
      const sanitizedCode = sanitizeCode(code, language);
      const detectedFunctionName = extractFunctionName(code, functionName);
      
      if (!detectedFunctionName) {
        throw new Error('Function name not found in code');
      }

      const evaluationResults = [];
      
      // Evaluate each test case
      for (const testCase of testCases) {
        try {
          const result = await this.evaluateTestCase(
            sanitizedCode,
            language,
            detectedFunctionName,
            testCase,
            timeLimit,
            memoryLimit
          );
          
          evaluationResults.push(result);
        } catch (error) {
          evaluationResults.push({
            passed: false,
            error: `Test case evaluation failed: ${error.message}`
          });
        }
      }

      // Calculate overall results
      const passedTestCases = evaluationResults.filter(r => r.passed).length;
      const overallScore = (passedTestCases / testCases.length) * 100;

      return {
        totalTestCases: testCases.length,
        passedTestCases,
        results: evaluationResults,
        overallScore,
        feedback: this.generateFeedback(overallScore, evaluationResults),
        executionSummary: this.calculateExecutionSummary(evaluationResults)
      };

    } catch (error) {
      throw new Error(`Code evaluation failed: ${error.message}`);
    }
  }

  async evaluateTestCase(code, language, functionName, testCase, timeLimit, memoryLimit) {
    const executableCode = this.prepareExecutableCode(code, functionName, testCase.input, language);
    
    const submission = {
      source_code: executableCode,
      language_id: Judge0Service.getLanguageId(language),
      stdin: testCase.input,
      expected_output: testCase.expectedOutput,
      cpu_time_limit: timeLimit,
      memory_limit: memoryLimit
    };

    const result = await Judge0Service.createSubmissionAndWait(submission);

    return this.parseJudge0Result(result, testCase);
  }

  prepareExecutableCode(code, functionName, input, language) {
    if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') {
      return `
${code}

// Test execution
const input = ${input};
const result = ${functionName}(...input);
console.log(JSON.stringify(result));
      `.trim();
    }

    return code;
  }

  parseJudge0Result(result, testCase) {
    const statusId = result.status.id;
    
    if (statusId === 3) {
      return {
        passed: true,
        actualOutput: result.stdout,
        executionTime: parseFloat(result.time),
        memoryUsage: result.memory
      };
    } else if (statusId === 4 || statusId === 5) {
      return {
        passed: false,
        actualOutput: result.stdout,
        error: result.status.description,
        executionTime: parseFloat(result.time),
        memoryUsage: result.memory
      };
    } else if (statusId === 6) {
      return {
        passed: false,
        error: result.compile_output || 'Compilation error',
        executionTime: 0,
        memoryUsage: 0
      };
    } else {
      return {
        passed: false,
        error: result.message || result.status.description || 'Unknown error',
        executionTime: parseFloat(result.time) || 0,
        memoryUsage: result.memory || 0
      };
    }
  }

  generateFeedback(score, results) {
    if (score === 100) {
      return 'Excellent! All test cases passed. Your solution is correct and efficient.';
    } else if (score >= 80) {
      return 'Good job! Most test cases passed. Review the failed cases for edge scenarios.';
    } else if (score >= 50) {
      const errors = results.filter(r => !r.passed && r.error);
      return `Partial success. Focus on understanding the algorithm better. Issues: ${errors.map(e => e.error).join(', ')}`;
    } else {
      return 'Needs improvement. Review the fundamental concepts and try again.';
    }
  }

  calculateExecutionSummary(results) {
    const validResults = results.filter(r => r.executionTime && r.memoryUsage);
    
    if (validResults.length === 0) {
      return { totalTime: 0, totalMemory: 0, averageTime: 0, averageMemory: 0 };
    }

    const totalTime = validResults.reduce((sum, r) => sum + (r.executionTime || 0), 0);
    const totalMemory = validResults.reduce((sum, r) => sum + (r.memoryUsage || 0), 0);

    return {
      totalTime: parseFloat(totalTime.toFixed(3)),
      totalMemory: parseFloat(totalMemory.toFixed(2)),
      averageTime: parseFloat((totalTime / validResults.length).toFixed(3)),
      averageMemory: parseFloat((totalMemory / validResults.length).toFixed(2))
    };
  }
}

export default new CodeEvaluationService();