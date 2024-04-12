import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom";
export default function ProblemSolve() {
    const [problems,setProblems] = useState([]);
    const navigate = useNavigate();
    const [cnt,setcnt] = useState(0);
    useEffect(() => {
        fetch("http://localhost:5000/api/data")
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setProblems(data);
            // setLoading(false);
           
          })
          .catch(error => {
            console.error("Error fetching daily problem:", error);
            // setLoading(false);
          });
        //   console.log(problems)
      }, []);
  return (
    <div className='flex col border-2 border-solid '>
        <div>
      {problems.map((problem)=>{
        setcnt(cnt+1);
        return <div className = 'flex row  '>
            <div>
              {problem._id}
           </div>
           <div className='fixed right-4'>
            {problem.difficulty}
           </div>
        </div>
        
      })}
      </div>
    </div>
  )
}
