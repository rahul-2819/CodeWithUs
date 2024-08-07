import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { auth } from "../firebase-config";
import {getDatabase, ref, update,push,set,get} from "firebase/database"

function CodeEditor(props) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("cpp");
  const [res, setRes] = useState([]);

 

  // -------------------------Judge0 compiler Api------------------------
  // const RunAndCheck = async (inputData, expectedOutput) => {
  //   const url = 'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json',
  // //       'X-RapidAPI-Key': '2e08084134msh96ecd1e3924992cp1a8095jsndeb224acd56d',
  //         'X-RapidAPI-Key': 'ac40a57194msh43667a7c72d4d16p15d807jsn1542329103f9',
  //       'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com'
  //     },
  //     body: JSON.stringify({
  //       language_id: 12,
  //       source_code: code,
  //       stdin: inputData
  //     })
  //   };

  //   try {
  //     const response = await fetch(url, options);
  //     const result = await response.json();

      
  //     return result.stdout === expectedOutput
  //   } catch (error) {
  //     console.error(error);
  //     return "Error";
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   props.handleLoading();
  //   const id = localStorage.getItem("CurrentQuestionName");

  //   try {
  //     const response = await fetch(`http://localhost:5000/api/testcases/${id}`);
  //     const data = await response.json();
  //     setTestCases(data.testCases);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   let answer = [];
  //   for (let key in testCases) {
  //     const testCase = testCases[key];
  //     const val = await RunAndCheck(testCase.input_data, testCase.expected_output);
  //     answer.push(val);
  //   }
  //   setRes(answer);
  //   props.updateOutput(answer);
  // };

  // const handleRun = async (e) => {
  //   e.preventDefault();
  //   props.handleLoading();
  //   const id = localStorage.getItem("CurrentQuestionName");

  //   try {
  //     const response = await fetch(`http://localhost:5000/api/exampletestcases/${id}`);
  //     const data = await response.json();
  //     setTestCases(data.testCases);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   let answer = [];
  //   for (let key in testCases) {
  //     const testCase = testCases[key];
  //     const val = await RunAndCheck(testCase.input_data, testCase.expected_output);
  //     answer.push(val);
  //   }
  //   setRes(answer);
  //   props.updateOutput(answer);
  // };

  const user = auth.currentUser;
  const db = getDatabase();


  useEffect(() => {
    const fetchCodeSnippet = async () => {
      const questionName = localStorage.getItem("CurrentQuestionName");
      if (questionName) {
        const snippetRef = ref(db, `code_snippets/${questionName}`);
        try {
          const snapshot = await get(snippetRef);
          if (snapshot.exists()) {
            let fetchedCode = snapshot.val();
            fetchedCode = fetchedCode.replace(/\\n/g, '\n');
            console.log(fetchedCode); // Log the fetched code to verify
            setCode(fetchedCode);
          } else {
            console.log("No code snippet found");
          }
        } catch (error) {
          console.error("Error fetching code snippet:", error);
        }
      }
    };

    fetchCodeSnippet();
  }, [db]);

  const RunAndCheck = async (Input_data) => {
    console.log(Input_data);
    const url = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "ac40a57194msh43667a7c72d4d16p15d807jsn1542329103f9",
        "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
      },
      body: JSON.stringify({
        language: lang,
        stdin: Input_data, // No input provided in this example
        files: [
          {
            name: `code.${lang}`,
            content: code,
          },
        ],
      }),
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("res", result.stdout);
      // setRes(result.stdout || result.stderr || "Unknown error occurred");
      if (result.stdout) {
        return result.stdout;
      }else if (result.stderr){
        alert("error");
        return result.stderr || "Unknown error";

      }
    } catch (error) {
      setRes("Error" + error.message);
      props.updateOutput("Error" + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      alert('You need to login to test ur code');
      return;
    }
    props.handleLoading();
    const id = localStorage.getItem("CurrentQuestionName");
    console.log(id);
    try {
      const response = await fetch(`http://localhost:5000/api/testcases/${id}`);
      const data = await response.json();
      console.log(data.testCases);
      const testcases = data.testCases;
      if(testcases !== null)
          Execute(testcases,id,"submit");
      props.setTc(data.testCases);
      // console.log(testCases);
    } catch (error) {
      console.log(error);
    }
  };
  const Execute = async(testCases,questionName,temp)=>{
    let answer = [];
    let allPassed = true;
    for (let key in testCases) {
      const val = await RunAndCheck(testCases[key].input_data);
      console.log("modified: " + val);
  
      // Normalize outputs
      let expected_output = val.replace(/\r?\n|\r/g, '').trim();
      let actual_output = testCases[key].expected_output.replace(/\r?\n|\r/g, '').trim();
  
      console.log("expected_output: " + expected_output);
      console.log("actual_output: " + actual_output);
  
      if (expected_output === actual_output) {
        console.log(1);
        answer.push(true);
      } else {
        console.log(0);
        answer.push(false);
        allPassed = false;
      }
    }
    setRes(answer);
    props.updateOutput(answer);
    if(temp === "submit"){
      const result = allPassed?"Accepted":"Wrong Answer";
      saveSubmission(questionName,result);
    }
  }

  const saveSubmission = (questionName,result)=>{
    const userId = user.uid;

    const submissionRef = ref(db,`submissions/${userId}/${questionName}`);
    const submissionData ={
      code,
      time: new Date().toISOString(),
      result
    };

    const newSubmissionRef = push(submissionRef);
    set(newSubmissionRef,submissionData);


    if(result === 'Accepted'){
      const solvedQuestionRef = ref(db,`users/${user.uid}/solved_questions/${questionName}`);
      update(solvedQuestionRef,{
        ...submissionData
      })
    }
    alert("submitted");
  }

  const handleRun = async (e) => {
    e.preventDefault();
    if(!user){
      alert('You need to login to test ur code');
      return;
    }
    props.handleLoading();
    const id = localStorage.getItem("CurrentQuestionName");
    console.log(id);
    try {
      const response = await fetch(`http://localhost:5000/api/exampletestcases/${id}`);
      const data = await response.json();
      console.log(data.testCases);
      const testcases = data.testCases;
      if(testcases !== null)
          Execute(testcases,id,"run");
      props.setTc(data.testCases);
    } catch (error) {
      console.log(error);
    }
    
  };

  useEffect(() => {
    // alert(res);
  }, [res]);

  return (
    <div className="container mx-auto p-6 bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <select
            className="border border-gray-400 px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100 hover:border-gray-500 mr-4"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e)=>{handleRun(e)}}
          >
            Run
          </button>
          <button
            className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="w-full max-w-screen-lg mx-auto"
       style={{ maxHeight: "calc(80vh - 250px)", overflow: "hidden" }}
       >
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage={lang}
          defaultValue="// Start typing your code here..."
          value={code}
          onChange={(e) => setCode(e)}
        />
      </div>
      {/* {res !== null ? res.map((result)=>{
        return <div>{result}</div>
      }):""} */}
    </div>
  );
}

export default CodeEditor;