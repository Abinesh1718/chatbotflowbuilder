import React from 'react';
import { Handle } from 'react-flow-renderer';
import Button from '@mui/material/Button';

const CustomNode = (props) => {
  const { data, selected } = props;
  const { label, setSelectedNode } = data;

  const handleClick = () => {
    setSelectedNode(props);
  };

  return (
    <div   onClick={handleClick}>
      <Button
        style={{
          width: '16rem',
          border: selected ? 'solid 2px green ' : 'solid 2px #0056b3',
          height: '4rem',
          backgroundColor: selected ? '#f0f0f0' : '#fff',
        }}
      >
        <Handle type="target" position="right" />
        {label}
        <Handle type="source" position="left" />
      </Button>
    </div>
  );
};

export default CustomNode;
