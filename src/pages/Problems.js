import React, { useEffect, useState,useCallback } from 'react'
import {useNavigate} from "react-router-dom";
export default function Problems() {
    const [problems,setProblems] = useState([]);
    const navigate = useNavigate();
  
  const fetched = useCallback(async(id)=>{
    await fetch("http://localhost:5000/api/data")
    .then(response => response.json())
    .then(data => {
      console.log(data)
     setProblems(data);
     
    })
    .catch(error => {
      console.error("Error fetching daily problem:", error);
    })
  })
  useEffect(()=>{
    let id = localStorage.getItem("CurrentQuestionId");
     fetched(id);
  },[]) 
      
  return (
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">title</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">difficulty</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {problems.map((problem, id) => {
        return (
          <tr key={id} class="bg-white">
            <td className="px-6 py-4 whitespace-nowrap " >{id + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap hover:cursor-pointer" id = {id+1} onClick={(e)=>{
              localStorage.setItem("CurrentQuestionId",e.target.id-1);
              localStorage.setItem("CurrentQuestionName",problem._id);
              alert(e.target.id);
              navigate("/solve")
              }}>{problem._id}</td>
            <td className="px-6 py-4 whitespace-nowrap ">{problem.difficulty}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>)
}
