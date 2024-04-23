import React from "react";
import QuestionDesc from '../components/QuestionDesc';
import SplitPane from 'react-split-pane';
import CodeEditor from '../components/CodeEditor';
import Output from "../components/Output";
import { useState } from "react";

function ProblemSolve(){
  const [output, setOutput] = useState([]); // State for output

  // Function to update the output state
  const updateOutput = (newOutput) => {
    setOutput(newOutput);
  };

  return (
    <SplitPane 
    // className='bg-black'
    split="vertical"
    minSize={300}
    maxSize={1200}
    defaultSize={500}
    style={{ position: 'relative' }}
    paneStyle={{ overflow: 'auto' }}
    resizerStyle={{
      background: 'gray',
      opacity: '0.5',
      zIndex: '1',
      cursor: 'ew-resize',
      width:'10px',
      
  }}
  >
      <QuestionDesc  />
      <SplitPane
        split="horizontal"
        minSize={100}
        maxSize={500}
        defaultSize={'50%'}
        style={{ position: 'relative' }}
        paneStyle={{ overflow: 'auto' }}
        resizerStyle={{
          background: 'gray',
          opacity: '0.5',
          zIndex: '1',
          cursor: 'ns-resize',
          height:'10px',
        }}
      >
         <CodeEditor updateOutput={updateOutput} /> 
         <Output res={output} />
      </SplitPane>
    </SplitPane>
  );
}

export default ProblemSolve;

