export function sanitizeCode(code, language) {
  const dangerousPatterns = [
    /require\(['"]fs['"]\)/g,
    /require\(['"]child_process['"]\)/g,
    /require\(['"]net['"]\)/g,
    /execSync|spawnSync/g,
    /process\.exit/g,
    /while\s*\(true\)/g,
    /for\s*\(;;\)/g
  ];

  let sanitizedCode = code;
  
  dangerousPatterns.forEach(pattern => {
    sanitizedCode = sanitizedCode.replace(pattern, '// Restricted: $&');
  });

  if (language.toLowerCase() === 'javascript') {
    sanitizedCode = sanitizedCode.replace(
      /eval\(/g,
      '// eval() is disabled for security reasons: '
    );
  }

  return sanitizedCode;
}

export function extractFunctionName(code, expectedFunctionName) {
  const functionRegex = /function\s+(\w+)\s*\(/;
  const arrowFunctionRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/;
  const varFunctionRegex = /var\s+(\w+)\s*=\s*function\s*\(/;
  let functionName = expectedFunctionName;

  const functionMatch = code.match(functionRegex);
  const arrowMatch = code.match(arrowFunctionRegex);
  const varMatch = code.match(varFunctionRegex);

  if (functionMatch) {
    functionName = functionMatch[1];
  } else if (arrowMatch) {
    functionName = arrowMatch[1];
  } else if (varMatch) {
    functionName = varMatch[1];
  }

  if (functionName && code.includes(functionName)) {
    return functionName;
  }

  return null;
}

export function validateCodeStructure(code, language) {
  const lines = code.split('\n');
  
  if (lines.length > 100) {
    throw new Error('Code too long (max 100 lines allowed)');
  }

  if (code.length > 5000) {
    throw new Error('Code too large (max 5000 characters)');
  }

  return true;
}