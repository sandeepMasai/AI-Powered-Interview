
import React, { useEffect, useState } from 'react';
import useDsa from '../../hooks/useDsa';
import ProblemStatement from '../../components/dsa/ProblemStatement';
import CodeEditor from '../../components/dsa/CodeEditor';



const DsaPractice = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [results, setResults] = useState(null);
  const { getProblems, evaluateSolution, loading, usingFallback } = useDsa();

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const response = await getProblems({ difficulty: 'easy' });
    if (response.problems.length > 0) {
      setSelectedProblem(response.problems[0]);
    }
  };

  const handleRunCode = async (code) => {
    if (!selectedProblem) {
      alert('No problem selected.');
      return;
    }

    const res = await evaluateSolution(selectedProblem._id, code);
    if (res && res.results) {
      setResults(res.results);
    } else {
      alert('Code execution failed. Please try again.');
    }
  };

  if (loading) return <div className="p-4">Loading problems...</div>;

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Problem Statement */}
      <div className="w-1/2 p-4 overflow-auto border-r border-gray-300">
        {usingFallback && <div className="text-yellow-600 mb-2">Demo mode: Using sample problems</div>}
        {selectedProblem && <ProblemStatement problem={selectedProblem} />}
      </div>

      {/* Code Editor & Results */}
      <div className="w-1/2 p-4 flex flex-col">
        <CodeEditor
          initialCode={selectedProblem?.starterCode || ''}
          language={selectedProblem?.language || 'javascript'}
          onRunCode={handleRunCode}
        />

        {/* Results Panel */}
        {results && (
          <div className="mt-4 bg-gray-100 p-3 rounded text-sm max-h-64 overflow-auto">
            <h3 className="font-semibold mb-2">Test Case Results</h3>
            {results.map((r, i) => (
              <div
                key={i}
                className={`border-l-4 px-2 py-1 mb-2 ${
                  r.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div><strong>Input:</strong> {r.input}</div>
                <div><strong>Expected:</strong> {r.expected}</div>
                <div><strong>Output:</strong> {r.output}</div>
                <div><strong>Status:</strong> {r.passed ? '✅ Passed' : '❌ Failed'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DsaPractice;

