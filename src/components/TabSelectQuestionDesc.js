import React, { useState } from 'react'
import QuestionDesc from './QuestionDesc'
import Submissions from './Submissions'
import QuesDiscuss from './QuesDiscuss';

export default function TabSelectQuestionDesc() {
    const [currentElement,setCurrentElement] = useState("Description");
    const handleClick = (event)=>{
        console.log(event);
        // alert(currentElement);
        setCurrentElement(event.target.id);
    }
  return (
    <>
    
    <div className="flex flex-row border-2 border-black-light">
        <div id = "Description" className="pl-4 pr-4 pt-1 pb-1 border-2 hover cursor-pointer" onClick={handleClick}>
            Description
            
        </div>
        {/* <div id = "Solution" className="pl-4 pr-4 pt-1 pb-1 border-2 hover cursor-pointer" onClick={handleClick}>
           solution
        </div> */}
        <div id = "Discuss" className="pl-4 pr-4 pt-1 pb-1 border-2 hover cursor-pointer" onClick={handleClick}>
           Discuss
        </div>
        <div id = "Submission" className="pl-4 pr-4 pt-1 pb-1 border-2 hover cursor-pointer" onClick={handleClick}>
           Submissions
        </div>
   
    </div>
    <div className={currentElement === "Description"?"":"hidden"}>
        <QuestionDesc/>
    </div>
    <div className={currentElement === "Discuss"?"":"hidden"}>
        <QuesDiscuss/>
    </div>
    <div className={currentElement === "Submission"?"":"hidden"}>
      <Submissions/>
    </div>
    </>
    
  )
}
