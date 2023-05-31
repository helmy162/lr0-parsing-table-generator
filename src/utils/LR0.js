// The main function to calculate LR(0) items.
export function getItems(LR0Items) {
    var C = [];
    C.push(getClosure(LR0Items, LR0Items.productions[0] + "'", "·" + LR0Items.productions[0]));

    var added = true;
    while(added){
        added = false;
        for (var i = 0; i < C.length; i++) {
            var items = C[i];
            C[i].goto = {};
            for (var j = 0; j < LR0Items.symbols.length; j++) {
                var symbol = LR0Items.symbols[j];
                var goto_result = getGotoResult(LR0Items, items, symbol);
                // TODO
                if (goto_result && isInArray(goto_result, C) === false) {
                    C.push(goto_result);
                    added = true;
                }
            }
        }
    }

    return C;
}

export function getDfaOutput(items) {
    var dfaOutput = '<div class="dfa-output">';
    dfaOutput += '<h2>Generated States: </h2>';
    dfaOutput += '<hr>';
  
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      dfaOutput += '<div class="item">';
      dfaOutput += '<div class="item-header"> State ' + i.toString() + ':</div>';
      var examinedGotoSymbols = [];
  
      for (var j = 0; j < items[i].length; j++) {
        var line = items[i][j];
        var itemString = line[0] + ' -> ' + line[1];
  
        var gotoSymbol = dotBeforeSymbol(line[1], false);
        if (gotoSymbol && isInArray(gotoSymbol, examinedGotoSymbols) === false) {
          examinedGotoSymbols.push(gotoSymbol);
          var gotoState = getGotoState(items, rhsWithSymbol(line[1]), i, j);
          dfaOutput += '<div class="item-line">';
          dfaOutput +=
            '<div class="item-line-content">' +
            itemString +
            '</div>' +
            '<div class="item-line-arrow">goto(' +
            gotoSymbol +
            ') = I' +
            gotoState +
            '</div>';
          dfaOutput += '</div>';
  
          item.goto[gotoSymbol] = gotoState;
        } else {
          dfaOutput += '<div class="item-line">';
          dfaOutput += '<div class="item-line-content">' + itemString + '</div>';
          dfaOutput += '</div>';
        }
      }
      dfaOutput += '</div>';
    }
  
    dfaOutput += '</div>';
  
    return dfaOutput;
  }
  

export function getLrPraseTable(items, LR0Items) {
    function Action(value, isState, isProduction) {
        this.value = value;
        this.isState = isState;
        this.isProduction = isProduction;
    }

    var lrPraseTable = [];
    var symbols = LR0Items.symbols;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        lrPraseTable.push({});
        for (var j = 0; j < symbols.length; j++) {
            var symbol = symbols[j];
            if (/[0-9+\-*/()a-z]/.test(symbol)) {
                lrPraseTable[i][symbol] = getAction(item, symbol);
            }
            if (/[A-Z]/.test(symbol)) {
                lrPraseTable[i][symbol] = getGOTOState(item, symbol);
            }
        }
    }

    setEndAction(lrPraseTable, symbols, LR0Items);

    return lrPraseTable;

    function getAction(item, symbol) {
        var action, value;
        // 当 item 没有 goto 一个的 state，此 item 就规约 item，此时 item.goto 为空对象
        if (JSON.stringify(item.goto) === JSON.stringify({})) {
            // 得到规约 item 的 Action,即规约的产生式序号
            for (var i = 0; i < LR0Items.aug_productions.length; i++) {
                var production = LR0Items.aug_productions[i];
                if (item[0].toString().split('·')[0] === production.toString()) {
                    value = i;
                }
            }
            if (value) {
                action = new Action(value, false, true);
            }
            return action;
        } else {
            // 否则为item 的Action状态
            var state = item.goto[symbol];
            if (state) {
                action = new Action(state, true, false);
            }
            return action;
        }
    }

    function getGOTOState(item, symbol) {
        var state = item.goto[symbol];
        return state;
    }

    function setEndAction(lrPraseTable, symbols, LR0Items) {
        for (var i = 0; i < lrPraseTable.length; i++) {
            for (var j = 0; j < symbols.length; j++) {
                var symbol = symbols[j];
                if (/[0-9+\-*/()a-z]/.test(symbol) && lrPraseTable[i][symbol] && lrPraseTable[i][symbol].isProduction) {
                    lrPraseTable[i]['#'] = lrPraseTable[i][symbol];
                }
            }
        }
        const end_cell = lrPraseTable[0][LR0Items.productions[0]];
        lrPraseTable[end_cell]['#'] = 'acc';
    }
}

export function formatLrPraseTable(lrPraseTable, LR0Items) {
    String.prototype.repeat = function (num) {
      return new Array(num + 1).join(this);
    };
  
    var symbols = LR0Items.symbols;
    var lrPraseTableString = '<div class="lr-table">';
    lrPraseTableString += '<div class="table-row">';
    lrPraseTableString += `<div class="table-cell" style="flex-basis:${1/(symbols.length + 2) * 100}%"><b>State</b></div>`;
    lrPraseTableString += `<div class="table-cell" style="flex-basis:${((symbols.filter((symbol) => /[0-9+\-*/()a-z]/.test(symbol))).length + 1) /(symbols.length + 2) * 100}%" ><b>Action</b></div>`;
    lrPraseTableString += `<div class="table-cell" style="flex-basis:${((symbols.filter((symbol) => /[A-Z]/.test(symbol))).length) /(symbols.length + 2) * 100}%"><b>Go-To</b></div>`;
    lrPraseTableString += '</div>';
  
    // Draw column attributes
    lrPraseTableString += '<div class="table-row">';
    lrPraseTableString += '<div class="table-cell"></div>';
    for (var i = 0; i < symbols.length; i++) {
      if (/[0-9+\-*/()a-z]/.test(symbols[i])) {
        lrPraseTableString += '<div class="table-cell">' + symbols[i] + '</div>';
      }
    }
    lrPraseTableString += '<div class="table-cell">#</div>';
    for (i = 0; i < symbols.length; i++) {
      if (/[A-Z]/.test(symbols[i])) {
        lrPraseTableString += '<div class="table-cell">' + symbols[i] + '</div>';
      }
    }
    lrPraseTableString += '</div>';
  
    // Draw table values
    for (i = 0; i < lrPraseTable.length; i++) {
      var item = lrPraseTable[i];
      lrPraseTableString += '<div class="table-row">';
      lrPraseTableString += '<div class="table-cell">' + i + '</div>';
  
      for (var j = 0; j < symbols.length; j++) {
        if (/[0-9+\-*/()a-z]/.test(symbols[j]) && lrPraseTable[i][symbols[j]]) {
          if (lrPraseTable[i][symbols[j]].isState === true) {
            lrPraseTableString += '<div class="table-cell action-state">s';
          } else if (lrPraseTable[i][symbols[j]].isProduction === true) {
            lrPraseTableString += '<div class="table-cell action-production">r';
          } else {
            lrPraseTableString += '<div class="table-cell">';
          }
          lrPraseTableString += lrPraseTable[i][symbols[j]].value + '</div>';
        } else if (/[0-9+\-*/()a-z]/.test(symbols[j])) {
          lrPraseTableString += '<div class="table-cell"></div>';
        }
      }
  
      if (lrPraseTable[i]['#'] === undefined) {
        lrPraseTableString += '<div class="table-cell"></div>';
      } else if (lrPraseTable[i]['#'] === 'acc') {
        lrPraseTableString += '<div class="table-cell action-accept">acc</div>';
      } else if (lrPraseTable[i]['#'].isProduction === true) {
        lrPraseTableString += '<div class="table-cell action-production">r' + lrPraseTable[i]['#'].value + '</div>';
      }
  
      for (j = 0; j < symbols.length; j++) {
        if (/[A-Z]/.test(symbols[j]) && lrPraseTable[i][symbols[j]]) {
          lrPraseTableString += '<div class="table-cell">' + lrPraseTable[i][symbols[j]] + '</div>';
        } else if (/[A-Z]/.test(symbols[j])) {
          lrPraseTableString += '<div class="table-cell"></div>';
        }
      }
  
      lrPraseTableString += '</div>';
    }
  
    lrPraseTableString += '</div>';
  
    return lrPraseTableString;
  }
  

// Returns the closure of a production as a list of tuples
function getClosure(LR0Items, LHS, RHS) {
    var J = [[LHS, RHS]];

    var done = [];
    var added = true;
    while (added) {
        added = false;
        for (var i = 0; i < J.length; i++) {
            var item =  J[i];
            var nextClosureChar = dotBeforeSymbol(item[1], true);
            if (nextClosureChar && done.indexOf(nextClosureChar) === -1) {
                done.push(nextClosureChar);
                for (var j = 1; j < LR0Items.aug_productions.length; j++) {
                    var prod = LR0Items.aug_productions[j];
                    if (prod[0] === nextClosureChar) {
                        var newProd = [prod[0], '·' + prod[1]];
                        J.push(newProd);
                        added = true;
                    }
                }
            }
        }
    }

    return J;
}

function isInArray(element, array) {
    for (var i = 0; i < array.length; i++) {
        if (JSON.stringify(element) === JSON.stringify(array[i])) {
            return true;
        }
    }
    return false;
}

// Returns the state to goto for the right-hand side rhs.
function getGotoResult(LR0Items, set_of_items, symbol) {
    var gotoResult = [];
    for (var i = 0; i < set_of_items.length; i++) {
        var item = set_of_items[i];
        var symbolStr = '·' + symbol;
        if (item[1].indexOf(symbolStr) !== -1) {
            var newRHS = item[1].replace('·' + symbol, symbol + '·');
            var res = getClosure(LR0Items, item[0], newRHS);
            for (var j = 0; j < res.length; j++) {
                var r = res[j];
                // r isIn gotoResult
                if (isInArray(r, gotoResult) === false) {
                    gotoResult.push(r);
                }
            }
        }
    }
    if (gotoResult.length === 0) {
        return undefined;
    }
    return gotoResult;
}

// Returns a symbol that is preceeded by an '·', or false if no such symbol exists
function dotBeforeSymbol(RHS, nonTerminal) {
    var regex;
    if (nonTerminal) {
        regex =/·([A-Z])/;
    } else {
        regex = /·(.)/;
    }
    var result = regex.exec(RHS);
    if (!result) {
        return undefined;
    } else {
        return result[1];
    }
}

// Returns the state to goto for the right-hand side rhs.
function getGotoState(data, rhs, oldIndexI, oldIndexJ) {
    if (!rhs) {
        return;
    }

    var symbol = dotBeforeSymbol(rhs, false);
    var gotoString = rhs.replace('·' + symbol, symbol + '·');
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            var item = data[i][j];
            if (item[1] === gotoString && item[0] === data[oldIndexI][oldIndexJ][0]) {
                return i;
            }
        }
    }
}

// Returns the entire right hand side of a production that contains an '·'
// but only if the '·' is not the last character.
function rhsWithSymbol(RHS) {
    var result = /.*·.+/.exec(RHS);
    if (!result) {
        return undefined;
    } else {
        return result[0];
    }
}
