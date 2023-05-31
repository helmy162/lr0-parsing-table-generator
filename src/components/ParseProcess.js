import React from 'react';

function ParseProcess({ process }) {
  return (
    <div>
      <p>Parse Process:</p>
      <textarea id="sentence-output" name="" rows="30" cols="55" value={process} readOnly/>
      </div>
    );
  }
  
  export default ParseProcess;
  