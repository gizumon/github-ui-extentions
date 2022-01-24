import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ISetting {
  baseUrl: string;
}

const Options = () => {
  const [hasSaved, setHasSaved] = useState<boolean>(true);
  const [baseUrl, setBaseUrl] = useState<string>('https://github.com');

  useEffect(() => {
    chrome.storage.sync.get(['baseUrl'], (items) => setBaseUrl(items.baseUrl));
  }, []);

  useEffect(() => {
    setHasSaved(false);
  }, [baseUrl])

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set({ baseUrl }, () => {
        // Update status to let user know options were saved.
        setHasSaved(true);
      }
    );
  };

  return (
    <>
      <div>
        <TextField
          label="Size"
          id="outlined-size-small"
          size="small"
          defaultValue={baseUrl}
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        onClick={saveOptions}
        startIcon={<SaveIcon />}
        disabled={hasSaved}
      >
        Save
      </Button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root')
);
