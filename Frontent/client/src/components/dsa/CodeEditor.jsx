
import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, Settings } from 'lucide-react'

const CodeEditor = ({ initialCode, language, onRunCode, onReset, isLoading }) => {
  const [code, setCode] = useState(initialCode)
  const [editorOptions, setEditorOptions] = useState({
    fontSize: 14,
    theme: 'vs-dark',
    minimap: { enabled: false }
  })

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleRun = () => {
    onRunCode(code)
  }

  const handleReset = () => {
    setCode(initialCode)
    onReset?.()
  }

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => {/* Handle language change */}}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            {languageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditorOptions(prev => ({
              ...prev,
              fontSize: prev.fontSize + 1
            }))}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="h-96">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme={editorOptions.theme}
          options={{
            fontSize: editorOptions.fontSize,
            minimap: { enabled: editorOptions.minimap.enabled },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on'
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400">
        Line: 1, Column: 1 | Language: {language.toUpperCase()} | UTF-8
      </div>
    </div>
  )
}

export default CodeEditor