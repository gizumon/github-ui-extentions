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
          fontSize: '0.9rem',
          marginBottom: '3px',
        }}
      >
        RegExp validations setting
      </div>
      <Chip
        color="success"
        avatar={<Avatar alt="gizumon" src="icon.png" />}
        label="Extension Option Link"
        variant="filled"
        component="a"
        onClick={() => {
          chrome?.runtime?.openOptionsPage()
        }}
        style={{
          cursor: "pointer",
          paddingLeft: '5px',
          paddingRight: '5px',
        }}
      />
      <div
        style={{
          margin: '10px 0px 3px',
          fontSize: '0.9rem',
        }}
      >
        How to use or Issue report
      </div>
      <Chip
        color="info"
        avatar={<Avatar alt="gizumon" src="gizumon.jpg" />}
        component="a"
        href="https://github.com/gizumon/github-ui-extentions#github-ui-extensions"
        label="Developer's Link"
        variant="filled"
        target="_blank"
        style={{
          cursor: "pointer",
          paddingLeft: '5px',
          paddingRight: '5px',
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
