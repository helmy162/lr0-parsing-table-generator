function PraseItem(index, stateStackStr, charsStackStr, inputArrayStr, action, goto) {
    this.index = index;
    this.stateStackStr = stateStackStr;
    this.charsStackStr = charsStackStr;
    this.inputArrayStr = inputArrayStr;
    this.action = action;
    this.goto = goto;
  }
  
export function getParseOutput(sentence, tableItems, aug_productions) { 
    const praseOutput = [];
  
    const stateStack = [0];
    const charsStack = ['$'];
    let action;
    let goto;
  
    // Init sentenceArray
    const inputArray = [];
    for (let i = 0; i < sentence.length; i++) {
      if (/[a-z]|$/.test(sentence.charAt(i)) === true) {
        inputArray.push(sentence.charAt(i));
      } else {
        // alert(' Error ');
        return (
            <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> 
                <p>Sorry, the sentence cannot be parsed with this grammar.</p>
            </div>
        )
      ;
      }
    }
  
    let i = 0;
    while (true) {
      if (action === 'acc') {
        break;
      }
  
      const oldStateStack = [...stateStack];
      const oldCharsStack = [...charsStack];
      const oldInputArray = [...inputArray];
      const state = stateStack[stateStack.length - 1];
      const char = inputArray[0];
      action = tableItems[state][char];
  
      if (action === undefined) {
        return (
            <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> 
                <p>Sorry, the sentence cannot be parsed with this grammar.</p>
            </div>
        )
      }
  
      // Move
      if (action.isState === true) {
        charsStack.push(char);
        stateStack.push(action.value);
  
        inputArray.shift();
      }
      // Reduce
      if (action.isProduction === true) {
        const deleteNumber = aug_productions[action.value][1].length;
        stateStack.splice(stateStack.length - deleteNumber);
        charsStack.splice(stateStack.length - deleteNumber);
  
        const bigChar = aug_productions[action.value][0];
        charsStack.push(bigChar);
  
        const newState = stateStack[stateStack.length - 1];
        goto = tableItems[newState][bigChar];
        stateStack.push(goto);
      }
  
      setPraseOutput(praseOutput, i, oldStateStack, oldCharsStack, oldInputArray, action, goto);
      i++;
    }
  
    return getFormattedOutput(praseOutput);
  }
  
  function setPraseOutput(praseOutput, i, stateStack, charsStack, inputArray, action, goto) {
    let actionStr = action.isState === true ? 'S' + action.value : 'r' + action.value;
    if (action === 'acc') {
      actionStr = 'acc';
    }
  
    const praseItem = new PraseItem(i + 1, stateStack.join(''), charsStack.join(''), inputArray.join(''), actionStr, goto);
  
    praseOutput.push(praseItem);
  }
  
  function getFormattedOutput(praseOutput) {
    return (
      <div className="prase-output">
        <div className="lr-table">
            <div className="table-row">
                <div className="table-cell"> <b>Step</b> </div>
                <div className="table-cell"> <b>State Stack</b> </div>
                <div className="table-cell"> <b>Symbol Stack</b> </div>
                <div className="table-cell"> <b>Input String</b> </div>
                <div className="table-cell"> <b>Action</b> </div>
                <div className="table-cell"> <b>Go-To</b> </div>
            </div>
            {praseOutput.map((praseItem, index) => (
              <div className="table-row" key={index}>
                <div className="table-cell">{praseItem.index}</div>
                <div className="table-cell">{praseItem.stateStackStr}</div>
                <div className="table-cell">{praseItem.charsStackStr}</div>
                <div className="table-cell">{praseItem.inputArrayStr}</div>
                <div className="table-cell">{praseItem.action}</div>
                <div className="table-cell">{praseItem.goto}</div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  