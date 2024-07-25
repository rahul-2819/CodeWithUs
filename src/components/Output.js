import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Output({ res, isLoading, tc }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    if (tc && tc.length > 0) {
      setTestCases(tc.map((_, index) => ({ result: null, index })));
    }
  }, [tc]);

  useEffect(() => {
    if (res.length > 0) {
      setTestCases(prevTestCases => {
        return prevTestCases.map((testCase, index) => {
          return { ...testCase, result: res[index] };
        });
      });
    }
  }, [res]);

  const toggleOutput = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="h-full overflow-auto bg-gray-900 text-gray-300">
      <div className="border border-gray-700 p-4">
        {isLoading && (
          <div className="flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2 text-blue-400" />
            <span className="text-xl font-semibold">Executing...</span>
          </div>
        )}
        {!isLoading && res.length === 0 && (
          <h2 className="text-xl font-semibold mb-4">Click run to see your output</h2>
        )}
        {(res.length > 0 || isLoading) && (
          <>
            {res.length > 0 && res.every(result => result) ? (
              <h2 className="text-xl font-semibold mb-4 text-green-400">Accepted</h2>
            ) : res.length > 0 ? (
              <h2 className="text-xl font-semibold mb-4 text-red-400">Wrong Answer</h2>
            ) : null}
            <div className="flex flex-wrap">
              {testCases.map(({ result, index }) => (
                <div key={index} className="w-1/4 px-2 mb-4">
                  <div
                    className={`border border-gray-700 p-2 cursor-pointer ${expandedIndex === index ? 'bg-gray-800' : ''}`}
                    onClick={() => toggleOutput(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 rounded-full ${result === null ? 'bg-gray-600 animate-pulse' : (result ? 'bg-green-500' : 'bg-red-500')}`}></div>
                      <div className={`font-semibold ${result === null ? 'text-gray-400' : (result ? 'text-green-400' : 'text-red-400')}`}>Test Case {index + 1}</div>
                      {result === null && (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin ml-auto text-blue-400" />
                      )}
                    </div>
                    {expandedIndex === index && (
                      <div className="mt-2">
                        {result !== null && (
                          <>
                            {result ? (
                              <span className="text-green-400">Correct</span>
                            ) : (
                              <span className="text-red-400">Wrong Answer</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Output;