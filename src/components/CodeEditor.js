import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

function CodeEditor(props) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("cpp");
  const [res, setRes] = useState([]);
  const [testCases, setTestCases] = useState(null);

  // -------------------------Judge0 compiler Apli------------------------
  const RunAndCheck = async (inputData, expectedOutput) => {
    const url = 'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
  //       'X-RapidAPI-Key': '2e08084134msh96ecd1e3924992cp1a8095jsndeb224acd56d',
          'X-RapidAPI-Key': 'ac40a57194msh43667a7c72d4d16p15d807jsn1542329103f9',
        'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        language_id: 12,
        source_code: code,
        stdin: inputData
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      
      return result.stdout === expectedOutput
    } catch (error) {
      console.error(error);
      return "Error";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.handleLoading();
    const id = localStorage.getItem("CurrentQuestionName");

    try {
      const response = await fetch(`http://localhost:5000/api/testcases/${id}`);
      const data = await response.json();
      setTestCases(data.testCases);
    } catch (error) {
      console.log(error);
    }

    let answer = [];
    for (let key in testCases) {
      const testCase = testCases[key];
      const val = await RunAndCheck(testCase.input_data, testCase.expected_output);
      answer.push(val);
    }
    setRes(answer);
    props.updateOutput(answer);
  };

  const handleRun = async (e) => {
    e.preventDefault();
    props.handleLoading();
    const id = localStorage.getItem("CurrentQuestionName");

    try {
      const response = await fetch(`http://localhost:5000/api/exampletestcases/${id}`);
      const data = await response.json();
      setTestCases(data.testCases);
    } catch (error) {
      console.log(error);
    }

    let answer = [];
    for (let key in testCases) {
      const testCase = testCases[key];
      const val = await RunAndCheck(testCase.input_data, testCase.expected_output);
      answer.push(val);
    }
    setRes(answer);
    props.updateOutput(answer);
  };

  // const RunAndCheck = async (Input_data) => {
  //   console.log(Input_data);
  //   const url = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "X-RapidAPI-Key": "ac40a57194msh43667a7c72d4d16p15d807jsn1542329103f9",
  //       "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
  //     },
  //     body: JSON.stringify({
  //       language: lang,
  //       stdin: Input_data, // No input provided in this example
  //       files: [
  //         {
  //           name: `code.${lang}`,
  //           content: code,
  //         },
  //       ],
  //     }),
  //   };
  //   try {
  //     const response = await fetch(url, options);
  //     const result = await response.json();
  //     console.log("res", result.stdout);
  //     // setRes(result.stdout || result.stderr || "Unknown error occurred");
  //     if (result.stdout) {
  //       return result.stdout;
  //     }
  //     alert("error");
  //     return result.stderr || "Unknown error";
  //     // return result.stdout;
  //   } catch (error) {
  //     setRes("Error" + error.message);
  //     props.updateOutput("Error" + error.message);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   props.handleLoading();
  //   const id = localStorage.getItem("CurrentQuestionName");
  //   console.log(id);
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/testcases/${id}`);
  //     const data = await response.json();
  //     console.log(data.testCases);
  //     setTestCases(data.testCases);
  //     // console.log(testCases);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   let answer = [];
  //   for (let key in testCases) {
  //     // console.log(testCases[key].input_data)
  //     const val = await RunAndCheck(testCases[key].input_data);
  //     console.log(val);

  //     if (val === testCases[key].expected_output) {
  //       console.log(1);
  //       answer.push(true);
  //     } else {
  //       console.log(0);
  //       answer.push(false);
  //     }
  //   }
  //   setRes(answer);

  //   props.updateOutput(answer);
  // };

  // const handleRun = async (e) => {
  //   e.preventDefault();
  //   props.handleLoading();
  //   const id = localStorage.getItem("CurrentQuestionName");
  //   console.log(id);
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/exampletestcases/${id}`);
  //     const data = await response.json();
  //     console.log(data.testCases);
  //     setTestCases(data.testCases);
  //     // console.log(testCases);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   let answer = [];
  //   for (let key in testCases) {
  //     // console.log(testCases[key].input_data)
  //     const val = await RunAndCheck(testCases[key].input_data);
  //     console.log(val);

  //     if (val === testCases[key].expected_output) {
  //       console.log(1);
  //       answer.push(true);
  //     } else {
  //       console.log(0);
  //       answer.push(false);
  //     }
  //   }
  //   setRes(answer);


  //   props.updateOutput(answer);
  // };

  useEffect(() => {
    // alert(res);
  }, [res]);

  return (
    <div className="container mx-auto p-6">
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
            onClick={handleRun}
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
