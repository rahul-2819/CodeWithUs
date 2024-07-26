import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      const data = await response.json();
      setProblems(data);
      setFilteredProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = problems.filter(problem => 
      (filter === 'All' || problem.difficulty === filter) &&
      problem._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProblems(filtered);
  }, [filter, problems, searchTerm]);

  const GetBg = (difficulty) => {
    if (difficulty === "Easy") return 'bg-green-500 text-white';
    else if (difficulty === "Medium") return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Problem Set</h1>
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative w-full sm:w-48">
            <select 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProblems.map((problem, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-102"
                  onClick={() => {
                    localStorage.setItem("CurrentQuestionId", index);
                    localStorage.setItem("CurrentQuestionName", problem._id);
                    navigate("/solve");
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{problem._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${GetBg(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}