import React from 'react';

const SentenceOutput = ({ praseSentence }) => {
  return (
    <div className="output-container">
    {
      praseSentence ? (
      <>
        <h2 className="output-title">Parse Result:</h2>
        {praseSentence}
      </>
      ) : null
    }
    
  </div>
  );
};

export default SentenceOutput;
