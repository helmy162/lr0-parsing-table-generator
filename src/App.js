import React, { useState, useEffect, useRef } from 'react';
import GrammarInput from './components/GrammarInput';
import DFAOutput from './components/DFAOutput';
import { getItems, getDfaOutput, getLrPraseTable, formatLrPraseTable } from './utils/LR0';
import TagManager from 'react-gtm-module';
import {Helmet} from "react-helmet";


const App = () => {
  const [grammar, setGrammar] = useState(`S\nS->A\nA->(AB)\nA->()\nB->(A)\nB->()`);
  const [dfaOutput, setDfaOutput] = useState('');
  const [lrParseTable, setLrParseTable] = useState('');

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
    console.log(grammer);
    var resultItems = getItems(LR0Items);
    var dfaOutput = getDfaOutput(resultItems);
    var lrPraseTable = getLrPraseTable(resultItems, LR0Items);
    var lrPraseTableString = formatLrPraseTable(lrPraseTable, LR0Items);
    setDfaOutput(dfaOutput);
    setLrParseTable(lrPraseTableString);
  };


  const nativeBanner = useRef()


///invoke.js
useEffect(() => {
if (nativeBanner.current && !nativeBanner.current.firstChild) {
    const script = document.createElement('script')
    script.async = true;
    script.src = '//pl19592643.highrevenuegate.com/7a0147249ddd99819b23528dcaa76ee5/invoke.js';
    script.dataset.cfasync = 'false';

    nativeBanner.current.append(script)
}
}, [nativeBanner])

  const banner = useRef()

  const atOptions = {
    key: 'f80b1c8c6bce64b195c2eef62b6898c5',
    format: 'iframe',
    height: 60,
    width: 468,
    params: {},
}

///invoke.js
useEffect(() => {
if (banner.current && !banner.current.firstChild) {
    const conf = document.createElement('script')
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//www.profitabledisplaynetwork.com/${atOptions.key}/invoke.js`
    conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

    banner.current.append(conf)
    banner.current.append(script)
}
}, [banner])


  return (
    <div className='app'>
      <div className='ad-container' id="container-7a0147249ddd99819b23528dcaa76ee5" ref={nativeBanner}>
      </div>
      <div className="container">
        <header className="header">
          <h1 className="title">LR(0) Parsing Table Generator</h1>
        </header>
        <main className="main">
          <GrammarInput onSubmit={handleGrammarSubmit} grammar={grammar} setGrammar={setGrammar} />
          <DFAOutput dfaOutput={dfaOutput} lrParseTable={lrParseTable} />
        </main>
        <footer className="footer">
          <p>&copy;2023 Made with ❤️ by <a href='https://www.linkedin.com/in/helmy16/' target='_blank'> Mohamed Abdelmaksoud</a></p>
        </footer>
      </div>
      <div className='ad-container' ref={banner}>
      </div>
    </div>
  );
};

export default App;
