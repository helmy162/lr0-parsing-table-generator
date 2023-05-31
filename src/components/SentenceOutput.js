import React from 'react';

const SentenceOutput = ({ sentenceOutput }) => {
  return (
    <div>
      <p>The parsing process:</p>
      <textarea id="sentence-output" name="" rows="30" cols="55" value={sentenceOutput} readOnly></textarea>
    </div>
  );
};

export default SentenceOutput;
