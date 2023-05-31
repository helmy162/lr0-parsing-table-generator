import React, { useState } from 'react';

const SentenceInput = ({ onParse }) => {
  const [sentence, setSentence] = useState('');

  const handleInputChange = (e) => {
    setSentence(e.target.value);
  };

  const handleSubmit = () => {
    onParse(sentence);
  };

  return (
    <div>
      <p>Please enter a sentence:</p>
      <input
        id="input-sentence"
        type="text"
        name=""
        value={sentence}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleSubmit}>
        Submit Input
      </button>
    </div>
  );
};

export default SentenceInput;
