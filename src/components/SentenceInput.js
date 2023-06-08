import React, { useState } from 'react';

const SentenceInput = ({ onParse, sentence, setSentence }) => {

  const handleInputChange = (e) => {
    setSentence(e.target.value);
  };

  const handleSubmit = () => {
    if(sentence.slice(-1) !== '$') onParse(sentence + '$');
    else onParse(sentence);
  };

  return (
    <>
   <h1 className="title header" >Parse Sentence</h1>
    <div className="input-container">
      <h2 className="input-title">Please enter a sentence:</h2>
      <input
        className="input-textarea"
        id="input-grammar"
        name=""
        rows="10"
        cols="30"
        placeholder='abcd$'
        value={sentence}
        onChange={handleInputChange}
      ></input>
      <button className="input-button" type="submit" onClick={handleSubmit}>
        Parse Sentence
      </button>
  </div>
   </>

  );
};

export default SentenceInput;
