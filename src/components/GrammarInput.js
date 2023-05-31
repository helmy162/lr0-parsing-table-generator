import React, { useState } from 'react';

const GrammarInput = ({ onSubmit, grammar, setGrammar }) => {
  const handleInputChange = (e) => {
    setGrammar(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(grammar);
  };

  return (
    <div className="input-container">
      <h2 className="input-title">Enter Grammar</h2>
      <textarea
        className="input-textarea"
        id="input-grammar"
        name=""
        rows="10"
        cols="30"
        value={grammar}
        onChange={handleInputChange}
      ></textarea>
      <button className="input-button" type="button" onClick={handleSubmit}>
        Get Parse Table
      </button>
    </div>
  );
};

export default GrammarInput;
