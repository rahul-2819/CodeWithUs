import React, { useState } from 'react'
import QuestionDesc from './QuestionDesc'
import Submissions from './Submissions'
import QuesDiscuss from './QuesDiscuss';

export default function TabSelectQuestionDesc() {
    const [currentElement, setCurrentElement] = useState("Description");
    
    const handleClick = (event) => {
        setCurrentElement(event.target.id);
    }

    return (
        <div className="bg-gray-900 text-gray-300">
            <div className="flex flex-row border-b border-gray-700">
                <TabButton 
                    id="Description" 
                    currentElement={currentElement} 
                    onClick={handleClick}
                >
                    Description
                </TabButton>
                <TabButton 
                    id="Discuss" 
                    currentElement={currentElement} 
                    onClick={handleClick}
                >
                    Discuss
                </TabButton>
                <TabButton 
                    id="Submission" 
                    currentElement={currentElement} 
                    onClick={handleClick}
                >
                    Submissions
                </TabButton>
            </div>
            <div className="mt-4">
                {currentElement === "Description" && <QuestionDesc />}
                {currentElement === "Discuss" && <QuesDiscuss />}
                {currentElement === "Submission" && <Submissions />}
            </div>
        </div>
    )
}

function TabButton({ id, currentElement, onClick, children }) {
    const isActive = id === currentElement;
    return (
        <button 
            id={id} 
            className={`px-4 py-2 focus:outline-none transition-colors duration-200 ${
                isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-400 hover:bg-gray-800"
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}