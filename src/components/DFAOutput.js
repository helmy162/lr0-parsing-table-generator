import React, {useState, useEffect} from 'react';

const DFAOutput = ({ dfaOutput, lrParseTable }) => {
  return (
    <div className="output-container">
      {
        dfaOutput || lrParseTable ? (
        <>
          <h2 className="output-title">DFA and LR(0) Parsing Table</h2>
          <div dangerouslySetInnerHTML={{__html: dfaOutput}}></div>
          <div dangerouslySetInnerHTML={{__html: lrParseTable}}></div>
        </>
        ) : null
      }
      
    </div>
  );
};

export default DFAOutput;
