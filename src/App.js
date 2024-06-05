import React, { useState, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import CustomNode from './CustomNode';
import Button from '@mui/material/Button';
import './App.css';

import TextareaAutosize from '@mui/material/TextareaAutosize';

const nodeTypes = {
  textMessage: CustomNode,
};

const initialNodes = [
  { id: '1', type: 'textMessage', data: { label: 'Text Message 1' }, position: { x: 250, y: 5 } },
];

const initialEdges = [];

let id = 2;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editedLabel, setEditedLabel] = useState('');

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onElementClick = (event, element) => {
    setSelectedNode(element);
    setEditedLabel(element.data.label);
  };

  const addNode = (type) => {
    const newNode = {
      id: id.toString(),
      type,
      data: { label: `${type} ${id}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    id++;
    setNodes((nds) => [...nds, newNode]);
  };

  const validateFlow = () => {
    let isValid = true;
    nodes.forEach((node) => {
      const nodeEdges = edges.filter((edge) => edge.source === node.id || edge.target === node.id);
      if (node.type === 'textMessage' && nodeEdges.length === 0) {
        isValid = false;
      }
    });
    if (!isValid) {
      alert('Validation failed: Some nodes do not have target handles.');
    } else {
      console.log('Flow is valid. Saving flow...', { nodes, edges });
    }
  };

  const handleLabelChange = (event) => {
    setEditedLabel(event.target.value);
  };

  const updateNodeLabel = () => {
    if (selectedNode) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editedLabel,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      setSelectedNode(null);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <header>
        <Button variant="outlined" onClick={validateFlow}>Save Changes</Button>
      </header>
      <div className="container">
        <div className="main">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  selected: selectedNode && node.id === selectedNode.id,
                  setSelectedNode,
                },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onElementClick={onElementClick}
              nodeTypes={nodeTypes}
            >
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        <div className="sidebar">
          <div className="buttons-container">
            <Button variant="outlined" onClick={() => addNode('textMessage')}>Add Text Message</Button>
          </div>
          {selectedNode && (
            <div className="edit-node-container">
              <TextareaAutosize
                aria-label="Edit node label"
                minRows={3}
                placeholder="Edit node label"
                value={editedLabel ? editedLabel : selectedNode?.data?.label}
                onChange={handleLabelChange}
              />
              <Button variant="outlined" onClick={updateNodeLabel}>Update Label</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
