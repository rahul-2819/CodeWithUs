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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {problems.map((problem, index) => (
            <tr key={index} className="hover:bg-gray-100 cursor-pointer" onClick={() => {
              localStorage.setItem("CurrentQuestionId", index);
              localStorage.setItem("CurrentQuestionName", problem._id);
              navigate("/solve");
            }}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{problem._id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{problem.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
