import React, { useState, useEffect } from "react";
import CodeEditor from './components/CodeEditor';

function App() {
  const [dailyProblem, setDailyProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then(response => response.json())
      .then(data => {
        setDailyProblem(data[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching daily problem:", error);
        setLoading(false);
      });
      console.log(dailyProblem)
  }, []);

 

  return (
    <div className="container mx-auto p-4 bg-green-100 flex">
      <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-xl flex-1">
        <h2 className="text-xl font-bold mb-4">Daily Problem</h2>
        {loading ? (
          <p>Loading...</p>
        ) : dailyProblem ? (
          <div>
            <h3 className="font-bold text-lg mb-2">{dailyProblem.questionTitle}</h3>
            <div className="overflow-auto max-w-xl">
              <p className="text-gray-700" dangerouslySetInnerHTML={{__html: dailyProblem.question}}></p>
            </div>
          </div>
        ) : (
          <p>No daily problem available.</p>
        )}
      </div>
      <div className="flex-1">
        <CodeEditor/>
      </div>
    </div>
  );
}

export default App;
