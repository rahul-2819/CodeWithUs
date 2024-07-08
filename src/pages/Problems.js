import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching daily problem:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const GetBg = (difficulty) => {
    if (difficulty === "Easy") return 'bg-green-600 text-white';
    else if (difficulty === "Medium") return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <div className="overflow-x-auto bg-gray-900 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <table className="min-w-full divide-y divide-gray-700 text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Difficulty</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {problems.map((problem, index) => (
            <tr
              key={index}
              className="hover:bg-gray-800 cursor-pointer bg-gray-800 m-2 rounded-lg"
              onClick={() => {
                localStorage.setItem("CurrentQuestionId", index);
                localStorage.setItem("CurrentQuestionName", problem._id);
                navigate("/solve");
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{problem._id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className={`rounded-xl w-2/4 ${GetBg(problem.difficulty)} p-2`}>
                  {problem.difficulty}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
