import axios from 'axios';

class Judge0Service {
  constructor() {
    this.baseURL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY || '';
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };
  }

  async createSubmission(submission) {
    try {
      const response = await axios.post(
        `${this.baseURL}/submissions?base64_encoded=false&wait=false`,
        submission,
        { headers: this.defaultHeaders }
      );

      return response.data.token;
    } catch (error) {
      console.error('Judge0 submission error:', error);
      throw new Error('Failed to create submission');
    }
  }

  async getSubmission(token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/submissions/${token}?base64_encoded=false`,
        { headers: this.defaultHeaders }
      );

      return response.data;
    } catch (error) {
      console.error('Judge0 fetch error:', error);
      throw new Error('Failed to fetch submission result');
    }
  }

  async createSubmissionAndWait(submission, maxRetries = 10, delay = 1000) {
    const token = await this.createSubmission(submission);
    let retries = 0;

    while (retries < maxRetries) {
      const result = await this.getSubmission(token);
      
      if (result.status.id !== 1 && result.status.id !== 2) {
        return result;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }

    throw new Error('Submission timeout: Maximum retries exceeded');
  }

  getLanguageId(language) {
    const languageMap = {
      'javascript': 63,
      'js': 63,
      'typescript': 74,
      'ts': 74,
      'python': 71,
      'py': 71,
      'java': 62,
      'c++': 54,
      'cpp': 54,
      'c': 50,
      'csharp': 51,
      'go': 60,
      'rust': 73,
      'ruby': 72
    };

    return languageMap[language.toLowerCase()] || 63;
  }
}

export default new Judge0Service();