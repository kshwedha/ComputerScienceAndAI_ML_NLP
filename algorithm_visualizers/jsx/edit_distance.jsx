import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const EditDistanceVisualizer = () => {
  const [word1, setWord1] = useState("cat");
  const [word2, setWord2] = useState("bat");
  const [dp, setDp] = useState([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [operations, setOperations] = useState([]);

  const initializeDP = (w1, w2) => {
    const rows = w1.length + 1;
    const cols = w2.length + 1;
    const newDp = Array(rows).fill(null).map(() => Array(cols).fill(null));
    
    // Initialize first row and column
    for (let i = 0; i <= w1.length; i++) {
      newDp[i][0] = i;
    }
    for (let j = 0; j <= w2.length; j++) {
      newDp[0][j] = j;
    }
    
    return newDp;
  };

  const getSteps = (w1, w2) => {
    const steps = [];
    const rows = w1.length + 1;
    const cols = w2.length + 1;
    
    // Step 0: Initialization
    steps.push({
      dp: initializeDP(w1, w2),
      i: -1, j: -1,
      explanation: "Initialize DP table: First row = insertions into empty string, First column = deletions to empty string",
      operation: "initialization"
    });
    
    // Steps for filling the DP table
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        const currentDp = JSON.parse(JSON.stringify(steps[steps.length - 1].dp));
        
        if (w1[i-1] === w2[j-1]) {
          currentDp[i][j] = currentDp[i-1][j-1];
          steps.push({
            dp: currentDp,
            i, j,
            explanation: `Characters match (${w1[i-1]} == ${w2[j-1]}): No operation needed, copy diagonal value`,
            operation: "match"
          });
        } else {
          const deletion = currentDp[i-1][j] + 1;
          const insertion = currentDp[i][j-1] + 1;
          const substitution = currentDp[i-1][j-1] + 1;
          const minVal = Math.min(deletion, insertion, substitution);
          
          currentDp[i][j] = minVal;
          
          let operation = "";
          if (minVal === deletion) operation = "delete";
          else if (minVal === insertion) operation = "insert";
          else operation = "substitute";
          
          steps.push({
            dp: currentDp,
            i, j,
            explanation: `Characters differ (${w1[i-1]} != ${w2[j-1]}): min(delete=${deletion}, insert=${insertion}, substitute=${substitution}) = ${minVal}`,
            operation
          });
        }
      }
    }
    
    return steps;
  };

  useEffect(() => {
    const steps = getSteps(word1, word2);
    setOperations(steps);
    setStep(0);
    setDp(steps[0]?.dp || []);
    setExplanation(steps[0]?.explanation || "");
    setCurrentI(steps[0]?.i || -1);
    setCurrentJ(steps[0]?.j || -1);
  }, [word1, word2]);

  useEffect(() => {
    if (operations.length > 0 && step < operations.length) {
      setDp(operations[step].dp);
      setExplanation(operations[step].explanation);
      setCurrentI(operations[step].i);
      setCurrentJ(operations[step].j);
    }
  }, [step, operations]);

  useEffect(() => {
    let interval;
    if (isPlaying && step < operations.length - 1) {
      interval = setInterval(() => {
        setStep(s => s + 1);
      }, 1500);
    } else if (step >= operations.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step, operations.length]);

  const handlePlay = () => {
    if (step >= operations.length - 1) {
      setStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (step < operations.length - 1) {
      setStep(step + 1);
    }
  };

  const getCellColor = (i, j, value) => {
    if (value === null) return "bg-gray-100";
    if (i === 0 || j === 0) return "bg-blue-100";
    if (i === currentI && j === currentJ) return "bg-yellow-300";
    if (step > 0 && dp[i] && dp[i][j] !== null) return "bg-green-100";
    return "bg-gray-100";
  };

  const getOperationColor = (op) => {
    switch (op) {
      case "match": return "text-green-600";
      case "delete": return "text-red-600";
      case "insert": return "text-blue-600";
      case "substitute": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Edit Distance Algorithm Visualizer</h1>
        <p className="text-gray-600 mb-4">
          This visualizes the dynamic programming solution to find the minimum edit distance (Levenshtein distance) between two strings.
        </p>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Word 1:</label>
            <input
              type="text"
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              className="px-3 py-2 border rounded-md"
              placeholder="Enter first word"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Word 2:</label>
            <input
              type="text"
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              className="px-3 py-2 border rounded-md"
              placeholder="Enter second word"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={step >= operations.length - 1}
          >
            <SkipForward size={16} />
            Next Step
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Step {step + 1} of {operations.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / operations.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">DP Table</h2>
          <div className="overflow-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-12 h-12 border border-gray-400 bg-gray-200"></th>
                  <th className="w-12 h-12 border border-gray-400 bg-gray-200 text-sm">ε</th>
                  {word2.split('').map((char, idx) => (
                    <th key={idx} className="w-12 h-12 border border-gray-400 bg-gray-200 text-sm font-mono">
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="w-12 h-12 border border-gray-400 bg-gray-200 text-sm">ε</th>
                  {dp[0]?.map((val, j) => (
                    <td key={j} className={`w-12 h-12 border border-gray-400 text-center text-sm font-mono ${getCellColor(0, j, val)}`}>
                      {val}
                    </td>
                  ))}
                </tr>
                {word1.split('').map((char, i) => (
                  <tr key={i}>
                    <th className="w-12 h-12 border border-gray-400 bg-gray-200 text-sm font-mono">
                      {char}
                    </th>
                    {dp[i + 1]?.map((val, j) => (
                      <td key={j} className={`w-12 h-12 border border-gray-400 text-center text-sm font-mono ${getCellColor(i + 1, j, val)}`}>
                        {val !== null ? val : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Step Explanation</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className={`text-sm ${getOperationColor(operations[step]?.operation)}`}>
              {explanation}
            </p>
            
            {currentI > 0 && currentJ > 0 && (
              <div className="mt-4 text-sm">
                <div className="font-medium mb-2">Current position: dp[{currentI}][{currentJ}]</div>
                <div className="space-y-1">
                  <div>Comparing: '{word1[currentI-1]}' vs '{word2[currentJ-1]}'</div>
                  {word1[currentI-1] !== word2[currentJ-1] && (
                    <div className="mt-2">
                      <div>Options:</div>
                      <ul className="ml-4 space-y-1">
                        <li className="text-red-600">Delete '{word1[currentI-1]}': {dp[currentI-1]?.[currentJ]} + 1</li>
                        <li className="text-blue-600">Insert '{word2[currentJ-1]}': {dp[currentI]?.[currentJ-1]} + 1</li>
                        <li className="text-orange-600">Substitute '{word1[currentI-1]}' → '{word2[currentJ-1]}': {dp[currentI-1]?.[currentJ-1]} + 1</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border"></div>
                <span>Base cases (initialization)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-300 border"></div>
                <span>Currently processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border"></div>
                <span>Already computed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border"></div>
                <span>Not yet computed</span>
              </div>
            </div>
          </div>

          {step === operations.length - 1 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Result</h3>
              <p className="text-blue-700">
                Minimum edit distance between "{word1}" and "{word2}" is: <strong>{dp[word1.length]?.[word2.length]}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDistanceVisualizer;