import React from "react";
import QuestionDesc from '../components/QuestionDesc';
import SplitPane from 'react-split-pane';
import CodeEditor from '../components/CodeEditor';

function ProblemSolve(){
  return (
    <SplitPane 
    // className='bg-black'
    split="vertical"
    minSize={300}
    maxSize={1200}
    defaultSize={300}
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
      <CodeEditor />
    </SplitPane>
  );
}

export default ProblemSolve;

