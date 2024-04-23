// Output.js
import React from 'react';

function Output({ res }) {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  const toggleOutput = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const allCorrect = res.every(result => result);

  return (
    <div className="h-80 overflow-auto">
      <div className="border border-black-400 p-4">
        {allCorrect ? (
          <h2 className="text-xl font-semibold mb-4 text-green-600">Accepted</h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4 text-red-600">Wrong Answer</h2>
        )}
        <div className="flex flex-wrap">
          {res.map((result, index) => (
            <div key={index} className="w-1/4 px-2 mb-4">
              <div
                className={`border p-2 cursor-pointer ${expandedIndex === index ? 'bg-gray-200' : ''}`}
                onClick={() => toggleOutput(index)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 mr-2 rounded-full ${result ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className={`font-semibold ${result ? 'text-green-600' : 'text-red-600'}`}>Test Case {index + 1}</div>
                </div>
                {expandedIndex === index && (
                  <div className="mt-2">
                    {result ? (
                      <span className="text-green-600">Correct</span>
                    ) : (
                      <span className="text-red-600">Wrong Answer</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Output;
