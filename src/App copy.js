import React, { useState, useEffect } from 'react';
import GrammarInput from './components/GrammarInput';
import DFAOutput from './components/DFAOutput';
import SentenceInput from './components/SentenceInput';
import SentenceOutput from './components/SentenceOutput';
import { getItems, getDfaOutput, getLrPraseTable, formatLrPraseTable} from './utils/LR0';


const App = () => {
  const [grammar, setGrammar] = useState(`E\nE->aA\nE->bB\nA->cA\nA->d\nB->cB\nB->d`);

// const [grammar, setGrammar] = useState('');

  console.log(grammar);
  const [dfaOutput, setDfaOutput] = useState('');
  const [lrParseTable, setLrParseTable] = useState('');
  const [sentence, setSentence] = useState('');
  const [sentenceOutput, setSentenceOutput] = useState('');

  const [LR0Items, setLR0Items] = useState({
    productions: [],
    aug_productions: [[]],
    symbols: [],
  });

  useEffect(() => {
    if(grammar) initLR0Items();
  }, [grammar]);

  function initLR0Items() {
    const productions = grammar.split('\n');

    const aug_productions = [[productions[0] + "'", productions[0]]];
    const regex = /([A-Z])->(.*)/;
    for (let i = 1; i < productions.length; i++) {
      const m = regex.exec(productions[i]);
      aug_productions.push([m[1], m[2]]);
    }

    const symbols = createListOfSymbols(aug_productions);
    symbols.sort();

    console.log('LR0 Items');
    console.log(productions);
    console.log(aug_productions);
    console.log(symbols);

    setLR0Items({
      productions,
      aug_productions,
      symbols,
    });
  }

  function createListOfSymbols(aug_productions) {
    const symbols = [];
    for (let i = 0; i < aug_productions.length; i++) {
      for (let j = 0; j < aug_productions[i][1].length; j++) {
        const char = aug_productions[i][1].charAt(j);
        if (
          char !== '·' &&
          char !== LR0Items.productions[0] + "'" &&
          symbols.indexOf(char) === -1
        ) {
          symbols.push(char);
        }
      }
    }
    return symbols;
  }

  function getAugmentedGrammar() {
    let grammar = 'Augmented Grammar\n-----------------\n';
    const array = LR0Items.aug_productions;
    console.log(LR0Items);
    for (let i = 0; i < array.length; i++) {
      grammar += array[i][0] + '->' + array[i][1] + '\n';
    }
    return grammar;
  }

  const handleGrammarSubmit = (grammar) => {
      initLR0Items(LR0Items, grammar);
      var grammer = getAugmentedGrammar(LR0Items);
      console.log(grammer);
      var resultItems = getItems(LR0Items);
      var dfaOutput = getDfaOutput(resultItems);
      var lrPraseTable = getLrPraseTable(resultItems, LR0Items);
      var lrPraseTableString = formatLrPraseTable(lrPraseTable, LR0Items);
      setDfaOutput(dfaOutput);
      setLrParseTable(lrPraseTableString);
  };

  const handleSentenceSubmit = (sentence) => {
    // Handle sentence submission and perform parsing
    // You can use your existing logic or external libraries for this step
    // Update the state variable: setSentenceOutput
  };

  return (
    <div>
      <GrammarInput onSubmit={handleGrammarSubmit} grammar={grammar} setGrammar={setGrammar} />
      <DFAOutput dfaOutput={dfaOutput} lrParseTable={lrParseTable} />
      {/* <SentenceInput onParse={handleSentenceSubmit} />
      <SentenceOutput sentenceOutput={sentenceOutput} /> */}
    </div>
  );
};

export default App;

