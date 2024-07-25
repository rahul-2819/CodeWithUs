import React, { useState, useEffect,useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faThumbsUp,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";


function QuestionDesc() {

    const [dailyProblem, setDailyProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags,setTags]=useState(false);

const fetched = useCallback(async(id)=>{
  await fetch("http://localhost:5000/api/data")
  .then(response => response.json())
  .then(data => {
   setDailyProblem(data[id]);
   console.log(dailyProblem);
    setLoading(false);
   
  })
  .catch(error => {
    console.error("Error fetching daily problem:", error);
    setLoading(false);
  })
})
useEffect(()=>{
  let id = localStorage.getItem("CurrentQuestionId");
   fetched(id);
},[]) 

const [liked,setLiked]=useState(false);
const [disliked,setDisliked]=useState(false);

const addLike=(amount)=>{
  alert('Liked');
  setLiked(true);
  setDailyProblem(prevState=>({
    ...prevState,
    likes: prevState.likes + amount
  }));

  // console.log(dailyProblem.likes);
  updateLikes(dailyProblem.questionTitle,amount);

};
const addDislike=(amount)=>{
  alert('Disliked');
  setDisliked(true);
  setDailyProblem(prevState=>({
    ...prevState,
    dislikes: prevState.dislikes+amount
  }));
  // console.log(dailyProblem.dislikes);
  updateDislikes(dailyProblem.questionTitle,amount);
};


const updateLikes=(id,amount)=>{
  fetch("http://localhost:5000/api/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      questionId: id,
      amount:amount 
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Likes updated in the database:", data);
  })
  .catch(error => {
    console.error("Error updating likes in the database:", error);
  });
}

const updateDislikes=(id,amount)=>{
  fetch("http://localhost:5000/api/dislikes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      questionId: id,
      amount:amount 
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Likes updated in the database:", data);
  })
  .catch(error => {
    console.error("Error updating likes in the database:", error);
  });

}

const toggleTag=()=>{
  setTags(!tags);
}



return (
  <div className="bg-gray-800 shadow-lg overflow-hidden">
    {loading ? (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading...</p>
      </div>
    ) : dailyProblem ? (
      <div>
        <div className="bg-gray-900 p-4">
          <h3 className="font-bold text-2xl text-white">
            {dailyProblem.questionTitle}
          </h3>
        </div>
        <div className="p-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p
              className="text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dailyProblem.question }}
            ></p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <button
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  liked ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => {
                  if (!liked) {
                    addLike(1);
                    if (disliked) {
                      addDislike(-1);
                      setDisliked(false);
                    }
                  } else {
                    addLike(-1);
                    setLiked(false);
                  }
                }}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="font-semibold">{dailyProblem.likes}</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  disliked ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => {
                  if (!disliked) {
                    addDislike(1);
                    if (liked) {
                      addLike(-1);
                      setLiked(false);
                    }
                  } else {
                    addDislike(-1);
                    setDisliked(false);
                  }
                }}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
                <span className="font-semibold">{dailyProblem.dislikes}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 border border-gray-600 rounded-lg overflow-hidden">
            <div
              className="bg-gray-700 p-3 flex justify-between items-center cursor-pointer"
              onClick={toggleTag}
            >
              <span className="font-bold text-gray-200">Topic Tags</span>
              <FontAwesomeIcon icon={tags ? faCaretUp : faCaretDown} className="text-gray-400" />
            </div>
            <div className={`bg-gray-800 p-3 ${tags ? "block" : "hidden"}`}>
              <div className="flex flex-wrap -m-1">
                {dailyProblem.topicTags.map((tag) => (
                  <span
                    className="m-1 bg-blue-900 text-blue-200 text-sm px-2 py-1 rounded-full"
                    key={tag.slug}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-4 text-center text-gray-400">
        No daily problem available.
      </div>
    )}
  </div>
)
}

export default QuestionDesc