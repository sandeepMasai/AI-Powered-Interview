import axios from 'axios'
import DsaQuestion from '../models/DsaQuestion.js'

// Map language names to Judge0 language IDs
const languageMap = {
  javascript: 63, 
  python: 71,
  cpp: 54,
  java: 62
}

export const evaluateSolution = async (req, res) => {
  try {
    const { problemId, code, language = 'javascript' } = req.body

    if (!problemId || !code) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // Fetch the question
    const question = await DsaQuestion.findById(problemId)
    if (!question) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    const functionName = question.functionName
    const testCases = question.testCases

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ success: false, message: 'No test cases available for this problem' })
    }

    const languageId = languageMap[language.toLowerCase()]
    if (!languageId) {
      return res.status(400).json({ success: false, message: 'Unsupported language' })
    }

    const results = []
    let passedTestCases = 0

    for (const testCase of testCases) {
      const wrappedCode = `
${code}

try {
  const result = ${functionName}(${testCase.input});
  console.log(result);
} catch (err) {
  console.error("Runtime Error:", err.message);
}
      `

      const submission = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        source_code: wrappedCode,
        language_id: languageId,
        expected_output: testCase.expectedOutput.toString(),
        stdin: "",
        cpu_time_limit: 2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,  // ← Make sure to set this in your .env
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      })

      const result = submission.data
      const passed = result.status && result.status.id === 3  // 3 = Accepted

      if (passed) passedTestCases++

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.stdout?.trim(),
        passed,
        error: result.stderr || result.compile_output || null
      })
    }

    const totalTestCases = testCases.length
    const overallScore = Math.round((passedTestCases / totalTestCases) * 100)

    const feedback =
      overallScore === 100
        ? 'Excellent work!'
        : overallScore >= 50
        ? 'Good attempt. Try to fix the failing test cases.'
        : 'Needs improvement. Review the fundamental concepts and try again.'

    res.json({
      success: true,
      evaluation: {
        totalTestCases,
        passedTestCases,
        results,
        overallScore,
        feedback,
        executionSummary: {
          totalTime: 0,
          totalMemory: 0,
          averageTime: 0,
          averageMemory: 0
        }
      },
      evaluationId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    })
  } catch (error) {
    console.error('Evaluation error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}
