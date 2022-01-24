import { Avatar, Chip } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  return (
    <div
      style={{
        minWidth: '350px',
        backgroundColor: '#999999',
        boxShadow: '#00000080 3px 3px 3px',
        borderRadius: '3px',
        padding: '10px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
        }}
      >
        Issue report or any comments
      </div>
      <Chip
        size="small"
        color="success"
        avatar={<Avatar alt="gizumon" src="icon.png" />}
        component="a"
        label="Developer's Link"
        variant="filled"
        href="https://github.com/gizumon/github-ui-extentions"
        target="_blank"
        style={{
          cursor: "pointer"
        }}
      />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
