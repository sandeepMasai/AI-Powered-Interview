export function generateTestCases(problemType, difficulty) {
  const testCases = [];
  
  switch (problemType) {
    case 'sliding_window':
      testCases.push(...generateSlidingWindowTestCases(difficulty));
      break;
    case 'two_pointers':
      testCases.push(...generateTwoPointersTestCases(difficulty));
      break;
    case 'arrays':
      testCases.push(...generateArraysTestCases(difficulty));
      break;
    default:
      testCases.push(...generateDefaultTestCases(difficulty));
  }

  return testCases;
}

function generateSlidingWindowTestCases(difficulty) {
  const testCases = [];
  
  if (difficulty === 'easy') {
    testCases.push(
      { input: '[1,2,3,4,5], 2', expectedOutput: '9' },
      { input: '[2,1,5,1,3,2], 3', expectedOutput: '9' }
    );
  } else {
    testCases.push(
      { input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[3,3,5,5,6,7]' },
      { input: '[1,-1], 1', expectedOutput: '[1,-1]' }
    );
  }

  return testCases;
}

function generateTwoPointersTestCases(difficulty) {
  return [
    { input: '[1,1,2,2,3]', expectedOutput: '3' },
    { input: '[0,0,1,1,1,2,2,3,3,4]', expectedOutput: '5' }
  ];
}

function generateArraysTestCases(difficulty) {
  return [
    { input: '[1,2,3,4,5], 2', expectedOutput: '[4,5,1,2,3]' },
    { input: '[-1,-100,3,99], 2', expectedOutput: '[3,99,-1,-100]' }
  ];
}

function generateDefaultTestCases(difficulty) {
  return [
    { input: '[]', expectedOutput: '[]' },
    { input: '[1]', expectedOutput: '[1]' }
  ];
}

export function generateRandomTestCases(problemType, count = 5) {
  const testCases = [];
  
  for (let i = 0; i < count; i++) {
    switch (problemType) {
      case 'arrays':
        testCases.push(generateRandomArrayTestCase());
        break;
      case 'strings':
        testCases.push(generateRandomStringTestCase());
        break;
      default:
        testCases.push(generateRandomNumberTestCase());
    }
  }
  
  return testCases;
}

function generateRandomArrayTestCase() {
  const length = Math.floor(Math.random() * 10) + 5;
  const arr = Array.from({ length }, () => Math.floor(Math.random() * 100));
  const k = Math.floor(Math.random() * 5) + 1;
  
  return {
    input: JSON.stringify(arr) + ', ' + k,
    expectedOutput: JSON.stringify(arr.slice(-k).concat(arr.slice(0, -k)))
  };
}

function generateRandomStringTestCase() {
  const words = ['hello', 'world', 'code', 'interview', 'preparation', 'ai', 'system'];
  const str = words.sort(() => Math.random() - 0.5).slice(0, 3).join(' ');
  
  return {
    input: JSON.stringify(str),
    expectedOutput: JSON.stringify(str.split(' ').reverse().join(' '))
  };
}

function generateRandomNumberTestCase() {
  const a = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);
  
  return {
    input: `${a}, ${b}`,
    expectedOutput: (a + b).toString()
  };
}