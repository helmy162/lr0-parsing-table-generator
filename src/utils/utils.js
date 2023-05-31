// Define the grammar productions
const productions = {
  'S': ['E'],
  'E': ['E+T', 'T'],
  'T': ['T*F', 'F'],
  'F': ['(E)', 'id']
};

// Define the start symbol
const startSymbol = 'S';

// Generate LR(0) items
const items = generateLR0Items(productions, startSymbol);

// Generate LR(0) parsing table
const parsingTable = generateLR0ParsingTable(items, productions, startSymbol);

// Input string to parse
const inputString = 'id+id*id';

// Parse the input string
const result = parseLR0(inputString, parsingTable, productions, startSymbol);

// Output the result
console.log(result);


export function parseGrammar (grammar) {
  const lines = grammar.split("\n");
  const productions = [];
  let startSymbol = "";

  for (let line of lines) {
    line = line.trim();
    if (line === "") continue;

    if (!startSymbol) {
      // The first non-empty line is assumed to be the start symbol
      startSymbol = line[0];
    }

    const arrowIndex = line.indexOf("->");
    if (arrowIndex === -1) {
      throw new Error(`Invalid production: ${line}`);
    }

    const left = line.slice(0, arrowIndex).trim();
    const right = line.slice(arrowIndex + 2).trim();

    productions.push({ left, right });
  }

  return { productions, startSymbol };
};

// Function to generate LR(0) items
function generateLR0Items(productions, startSymbol) {
  const items = [];

  // Add the augmented production as the initial item
  const initialItem = [startSymbol + "'", "·" + startSymbol];
  items.push(initialItem);

  let added = true;
  while (added) {
    added = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const dotIndex = item[1].indexOf('·');

      // If the dot is at the end of the item, skip
      if (dotIndex === item[1].length - 1) {
        continue;
      }

      const nextSymbol = item[1][dotIndex + 1];

      // If the next symbol is a non-terminal, expand it
      if (productions[nextSymbol]) {
        for (let j = 0; j < productions[nextSymbol].length; j++) {
          const newItem = [nextSymbol, "·" + productions[nextSymbol][j]];
          if (!isItemInArray(newItem, items)) {
            items.push(newItem);
            added = true;
          }
        }
      }
    }
  }

  return items;
}

// Function to check if an item is already in the array
function isItemInArray(item, array) {
  for (const arrItem of array) {
    if (arrItem[0] === item[0] && arrItem[1] === item[1]) {
      return true;
    }
  }
  return false;
}

// Function to generate LR(0) parsing table
function generateLR0ParsingTable(items, productions, startSymbol) {
  const parsingTable = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dotIndex = item[1].indexOf('·');

    if (dotIndex === item[1].length - 1) {
      // Dot is at the end, reduce action
      if (item[0] === startSymbol + "'") {
        // Accept state
        parsingTable[i] = { $: 'acc' };
      } else {
        // Reduce production
        const productionIndex = productions[item[0]].indexOf(item[1].replace('·', ''));
        if (productionIndex !== -1) {
          const production = item[0] + " -> " + item[1].replace('·', '');
          const followSet = getFollowSet(item[0], productions, startSymbol);
          for (const symbol of followSet) {
            if (!parsingTable[i]) {
              parsingTable[i] = {};
            }
            parsingTable[i][symbol] = 'r' + productionIndex;
          }
        }
      }
    } else {
      // Dot is not at the end, shift or goto action
      const nextSymbol = item[1][dotIndex + 1];
      const nextState = getGotoState(items, item, nextSymbol);
      if (!parsingTable[i]) {
        parsingTable[i] = {};
      }
      if (productions[nextSymbol]) {
        // Goto action for non-terminal
        parsingTable[i][nextSymbol] = nextState;
      } else {
        // Shift action for terminal
        parsingTable[i][nextSymbol] = 's' + nextState;
      }
    }
  }

  return parsingTable;
}

// Function to calculate the follow set for a non-terminal
function getFollowSet(nonTerminal, productions, startSymbol) {
  const followSet = new Set();

  // If the non-terminal is the start symbol, add '$' to the follow set
  if (nonTerminal === startSymbol) {
    followSet.add('$');
  }

  for (const [lhs, rhs] of Object.entries(productions)) {
    for (const production of rhs) {
      const index = production.indexOf(nonTerminal);
      if (index !== -1 && index < production.length - 1) {
        const nextSymbol = production[index + 1];
        if (productions[nextSymbol]) {
          // If the next symbol is a non-terminal, add first set to the follow set
          const firstSet = getFirstSet(production.substring(index + 1), productions);
          for (const symbol of firstSet) {
            if (symbol !== 'ε') {
              followSet.add(symbol);
            }
          }
          // If the first set contains ε, add follow set of the non-terminal to the follow set
          if (firstSet.has('ε')) {
            const followNonTerminal = production.substring(index + 2);
            if (followNonTerminal !== '') {
              const followNonTerminalSet = getFollowSet(followNonTerminal, productions, startSymbol);
              for (const symbol of followNonTerminalSet) {
                followSet.add(symbol);
              }
            }
          }
        } else {
          // If the next symbol is a terminal, add it to the follow set
          followSet.add(nextSymbol);
        }
      }
    }
  }

  return followSet;
}

// Function to calculate the first set for a string
function getFirstSet(str, productions) {
  const firstSet = new Set();

  if (str === '') {
    // Empty string, add ε to the first set
    firstSet.add('ε');
    return firstSet;
  }

  const firstSymbol = str[0];
  if (productions[firstSymbol]) {
    // First symbol is a non-terminal, add its first set to the first set
    const firstNonTerminalSet = getFirstSet(productions[firstSymbol][0], productions);
    for (const symbol of firstNonTerminalSet) {
      if (symbol !== 'ε') {
        firstSet.add(symbol);
      }
    }
    // If the first set contains ε, add first set of the remaining symbols to the first set
    if (firstNonTerminalSet.has('ε')) {
      const remainingSet = getFirstSet(str.substring(1), productions);
      for (const symbol of remainingSet) {
        firstSet.add(symbol);
      }
    }
  } else {
    // First symbol is a terminal, add it to the first set
    firstSet.add(firstSymbol);
  }

  return firstSet;
}

// Function to get the goto state for an item and symbol
function getGotoState(items, item, symbol) {
  const newState = [];

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    const dotIndex = currentItem[1].indexOf('·');
    if (dotIndex !== -1 && currentItem[0] === item[0] && currentItem[1][dotIndex + 1] === symbol) {
      newState.push(currentItem[0], currentItem[1].replace('·', ''));
    }
  }

  if (newState.length === 0) {
    return -1;
  }

  const newStateIndex = items.findIndex(i => i[0] === newState[0] && i[1] === newState[1]);
  if (newStateIndex === -1) {
    items.push(newState);
    return items.length - 1;
  }

  return newStateIndex;
}

// Function to parse the input string using the LR(0) parsing table
function parseLR0(inputString, parsingTable, productions, startSymbol) {
  const stack = [0];
  const output = [];

  let inputIndex = 0;

  while (true) {
    const currentState = stack[stack.length - 1];
    const currentSymbol = inputString[inputIndex];

    if (parsingTable[currentState] && parsingTable[currentState][currentSymbol]) {
      const action = parsingTable[currentState][currentSymbol];

      if (action === 'acc') {
        // Accept state reached, parsing successful
        return output;
      } else if (action[0] === 's') {
        // Shift action
        const nextState = parseInt(action.substring(1));
        stack.push(currentSymbol);
        stack.push(nextState);
        inputIndex++;
      } else if (action[0] === 'r') {
        // Reduce action
        const productionIndex = parseInt(action.substring(1));
        const production = productions[startSymbol][productionIndex];
        const [lhs, rhs] = production.split(' -> ');

        // Pop symbols and states from the stack
        const popCount = 2 * rhs.length;
        stack.splice(stack.length - popCount, popCount);

        // Push the non-terminal and the goto state onto the stack
        const nextState = stack[stack.length - 1];
        stack.push(lhs);
        stack.push(nextState);

        // Output the production
        output.push(production);
      }
    } else {
      // Invalid input string, parsing failed
      return null;
    }
  }
}


const App = () => {
  const lr0Items = generateLR0Items(productions, startSymbol);
  const lr0ParsingTable = generateLR0ParsingTable(lr0Items, productions, startSymbol);

  return (
    <div>
      <h1>LR(0) Parsing Table</h1>
      <table>
        <thead>
          <tr>
            <th>State</th>
            {Object.keys(productions).map((symbol) => (
              <th key={symbol}>{symbol}</th>
            ))}
            {Object.keys(productions[startSymbol]).map((symbol) => (
              <th key={symbol}>{symbol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(lr0ParsingTable).map((state) => (
            <tr key={state}>
              <td>{state}</td>
              {Object.keys(productions).map((symbol) => (
                <td key={symbol}>{lr0ParsingTable[state][symbol] || ''}</td>
              ))}
              {Object.keys(productions[startSymbol]).map((symbol) => (
                <td key={symbol}>{lr0ParsingTable[state][symbol] || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
