import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

function CodeEditor() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("cpp");
  const [res, setRes] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'https://onecompiler-apis.p.rapidapi.com/api/v1/run';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ac40a57194msh43667a7c72d4d16p15d807jsn1542329103f9',
        'X-RapidAPI-Host': 'onecompiler-apis.p.rapidapi.com'
      },
      body: JSON.stringify({
        language: lang,
        stdin: '', // No input provided in this example
        files: [
          {
            name: `code.${lang}`,
            content: code
          }
        ]
      })
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setRes(result.stdout || result.stderr || "Unknown error occurred");
    } catch (error) {
      setRes("Error" + error.message);
    }
  };

  useEffect(() => {
    // alert(res);
  }, [res]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        {/* <div>
          <h1 className="text-3xl font-semibold"></h1>
          <p className="text-gray-600"></p>
        </div> */}
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="w-full max-w-screen-lg mx-auto">
        <Editor
          height="80vh"
          theme="vs-dark"
          defaultLanguage={lang}
          defaultValue="// Start typing your code here..."
          value={code}
          onChange={(e) => setCode(e)}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
