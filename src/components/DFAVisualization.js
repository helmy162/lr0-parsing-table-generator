import React from 'react';
import  Graph  from 'react-graph-vis';

const DFAVisualization = ({ dfaObject }) => {
  // Preprocess the DFA object to extract nodes and edges
  const nodes = [];
  const edges = [];

  dfaObject.forEach((state, index) => {
    const nodeId = `node-${index}`;
    const label = `${index}`;
    let title = '';
    for (var j = 0; j < state?.length; j++) {
        var line = state[j];
        var itemString = line[0] + ' -> ' + line[1];       
        title += (`${itemString}\n\n`);
    }

    nodes.push({ id: nodeId, label: title, title, color: index == '0' ? '#ff0000' : '#0000ff' });
    for (const [key, value] of Object.entries(state.goto)) {
        const fromNodeId = nodeId;
        const toNodeId = `node-${value}`;
        const label = key;
        edges.push({ from: fromNodeId, to: toNodeId, label: label });
    }
  });

  const graph = {
    nodes: nodes,
    edges: edges,
  };

  const options = {
    autoResize: true,
    physics: {
        enabled: false,
    },
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
      length: 250,
    },
    nodes: {
      shape: 'box',
      font: {
        color: '#ffffff',
      },
    },
    height: '600px',
  };

  return <Graph graph={graph} options={options} />;
};

export default DFAVisualization;
