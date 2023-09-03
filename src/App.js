import React, { useState, useEffect } from 'react';
import GrammarInput from './components/GrammarInput';
import DFAOutput from './components/DFAOutput';
import SentenceInput from './components/SentenceInput';
import { getItems, getDfaOutput, getLrPraseTable, formatLrPraseTable } from './utils/LR0';
import {getParseOutput} from './utils/parser';
import TagManager from 'react-gtm-module';
import SentenceOutput from './components/SentenceOutput';
import DFAVisualization from './components/DFAVisualization';

const App = () => {
  const [grammar, setGrammar] = useState(`S\nS->A\nA->(AB)\nA->()\nB->(A)\nB->()`);
  const [dfaOutput, setDfaOutput] = useState('');
  const [dfaResult, setDfaResult] = useState('');
  const [lrParseTable, setLrParseTable] = useState('');
  const [lrParseTableRaw, setlrParseTableRaw] = useState('');
  const [sentence, setSentence] = useState('');
  const [praseSentence, setPraseSentence] = useState('');

  const [LR0Items, setLR0Items] = useState({
    productions: [],
    aug_productions: [[]],
    symbols: [],
  });

  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-K3WB5RH' });
    }, []);

  useEffect(() => {
    if (grammar) initLR0Items();
  }, [grammar]);

  function initLR0Items() {
    const productions = grammar.split('\n');

    const aug_productions = [[productions[0] + "'", productions[0]]];
    const regex = /([A-Z])->(.*)/;
    for (let i = 1; i < productions.length; i++) {
      const m = regex.exec(productions[i]);
      if(m) aug_productions.push([m[1], m[2]]);
    }

    const symbols = createListOfSymbols(aug_productions);
    symbols.sort();

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
    var resultItems = getItems(LR0Items);
    var dfaOutput = getDfaOutput(resultItems);
    var lrPraseTable = getLrPraseTable(resultItems, LR0Items);
    setlrParseTableRaw(lrPraseTable);
    var lrPraseTableString = formatLrPraseTable(lrPraseTable, LR0Items);
    setDfaResult(resultItems);
    setDfaOutput(dfaOutput);
    setLrParseTable(lrPraseTableString);
  };

  const handleSentenceSubmit = (sentence) => {
    if(!lrParseTable) {
      alert('Please enter a valid grammar first!');
      return;
    }
    const praseSentenceOutput = getParseOutput(sentence, lrParseTableRaw, LR0Items.aug_productions);
    setPraseSentence(praseSentenceOutput);
  }

  return (
    <div className="container">
      <header className="header">
        <img src='./logo.png' alt='LR(0) Parser' className='title' width='250' height='110'/>
        <h3>Description</h3>
        <p className="description">
          LR(0) Parser is a tool that visualizes the DFA and LR(0) table, making it easy to understand the parsing process. Create and analyze LR(0) items, explore augmented grammars, and generate parse tables effortlessly.
        </p>
      </header>
      <main className="main">
        <GrammarInput onSubmit={handleGrammarSubmit} grammar={grammar} setGrammar={setGrammar} />
        {dfaResult && <DFAVisualization dfaObject={dfaResult} />}
        <DFAOutput dfaOutput={dfaOutput} lrParseTable={lrParseTable} />
        {
          dfaOutput &&  <> <hr className="divider" /> <SentenceInput onParse={handleSentenceSubmit} sentence={sentence} setSentence={setSentence}/> </>
        }
        <SentenceOutput praseSentence={praseSentence} />
      </main>
      <div className="instruction-section">
        <h3>Instructions</h3>
        <ol>
          <li>The first line shall contain the start non-terminal only. </li>
          <li>Separate production rule with a new line.</li>
          <li>DO NOT separate tokens with whitespaces.</li>
          <li>DO NOT ADD the end-of-input symbol ($). </li>
          <li>DO NOT add augmented grammar. </li>
        </ol>
      </div>
      <footer className="footer">
        <p>&copy;2023 Made with ❤️ by <a href='https://www.linkedin.com/in/helmy16/' target='_blank'> Mohamed Abdelmaksoud</a></p>
      </footer>
    </div>
  );
};

export default App;