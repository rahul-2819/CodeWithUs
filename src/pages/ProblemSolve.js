import React, { useState, useEffect,useCallback } from "react";
import CodeEditor from '../components/CodeEditor';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function ProblemSolve() {
  const [dailyProblem, setDailyProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags,setTags]=useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             let id = localStorage.getItem("CurrentQuestionId");
//             let cachedData = localStorage.getItem("cachedData");
//             let data;

//             if (cachedData) {
//                 data = JSON.parse(cachedData);
//             } else {
//                 const response = await fetch("http://localhost:5000/api/data");
//                 data = await response.json();
//                 localStorage.setItem("cachedData", JSON.stringify(data));
//             }

//             console.log(data[id]);
//             setDailyProblem(data[id]);
//             console.log(dailyProblem);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching daily problem:", error);
//             // setLoading(false);
//         }
//     };

//     fetchData();
// }, []);

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
  <div className="container mx-auto p-4 bg-blue-300 flex">
    <div className="p-4 bg-gray-200 rounded-lg shadow-md max-w-xl flex-1">
      <h2 className="text-xl font-bold mb-4">Daily Problem</h2>
      {loading ? (
        <p>Loading...</p>
      ) : dailyProblem ? (
        <div>
          <h3 className="font-bold text-lg mb-2">{dailyProblem.questionTitle}</h3>
          <div className="overflow-auto max-w-xl">
            <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html: dailyProblem.question}}></p>
            <div className="flex items-center mt-4">
              <div className="flex items-center mr-4 cursor-pointer" onClick={()=>{
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
              }}>
                <FontAwesomeIcon className={` ${liked ? "text-green-700" : "opacity-50"}`} icon={faThumbsUp}/>
                <span className="font-semibold ml-2">{dailyProblem.likes}</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={()=>{
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
              }}>
                <FontAwesomeIcon className={` ${disliked ? "text-red-700" : "opacity-50"}`} icon={faThumbsDown}/>
                <span className="font-semibold ml-2">{dailyProblem.dislikes}</span>
              </div>
            </div>
            <button onClick={toggleTag} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Toggle Tags</button>
            {tags && (
              <div className="mt-4">
                {dailyProblem.topicTags.map(tag => (
                  <span className="mr-2 mb-2 bg-gray-400 text-sm rounded-full px-2 py-1" key={tag.slug}>{tag.name}</span>
                ))}
              </div>
            )}
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

export default ProblemSolve;

