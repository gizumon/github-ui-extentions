import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, FormControlLabel, FormGroup, FormLabel, IconButton, Paper, Switch, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Info } from '@mui/icons-material';

const enabledGitHubURLSettingFeature = false;

export interface IBlacklist {
  baseRegExp: string;
  headRegExp: string;
  enablePreventMerge: boolean;
}

const defaultBlacklist = {
  baseRegExp: '',
  headRegExp: '',
  enablePreventMerge: false,
}

const Options = () => {
  const [hasSaved, setHasSaved] = useState<boolean>(true);
  const [blacklists, setBlacklists] = useState<IBlacklist[]>([]);

  useEffect(() => {
    chrome.storage.sync.get(['blacklists'], (items) => {
      console.log('get chrome storage', items)
      setBlacklists(items?.blacklists || [])
    });
  }, []);

  useEffect(() => {
    setHasSaved(false);
  }, [blacklists])

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set({ blacklists }, () => setHasSaved(true));
  };

  return (
    <Box
      component="form"
      sx={{
        minWidth: '600px',
        '& .MuiTextField-root': { m: 1, width: '80%' },
      }}
      noValidate
      autoComplete="on"
    >
      <FormGroup
        sx={{
          margin: '10px',
        }}
      >
        <FormLabel
          style={{
            alignItems: 'center',
          }}
          component="legend"
        >
          Merge Regular Expression Blacklist
          <Tooltip
            title={
              "You can set Blacklist for each base branch (merge target branch) and head branch (merge source branch)." +
              "If you set multiple blacklists, each condition will be evaluated with OR."
            }
          >
            <IconButton>
              <Info />
            </IconButton>
          </Tooltip>
        </FormLabel>
        {
          blacklists.length > 0 && blacklists.map(((bl, i) => (
            <Paper
              style={{
                margin: '10px',
              }}
              elevation={3}
            >
              <Typography
                margin='10px'
                height='32px'
              >
                Blacklist [{i + 1}]
                <IconButton
                  style={{
                    float: 'right',
                  }}
                  onClick={() => setBlacklists(blacklists.filter((_, bli) => i !== bli))}
                >
                  <Delete />
                </IconButton>
              </Typography>
              <TextField
                label="Base branch (target)"
                size="small"
                placeholder="If empty, then allow all base branch"
                defaultValue={bl.baseRegExp}
                value={bl.baseRegExp}
                onChange={(e) => setBlacklists(bls => {
                  const blacklists = [...bls];
                  blacklists[i].baseRegExp = e.target.value;
                  return blacklists;
                })}
              />
              <TextField
                label="Head branch (source)"
                size="small"
                placeholder="If empty, then allow all head branch"
                defaultValue={bl.headRegExp}
                value={bl.headRegExp}
                onChange={(e) => setBlacklists(bls => {
                  const blacklists = [...bls];
                  blacklists[i].headRegExp = e.target.value;
                  return blacklists;
                })}
              />
              <FormControlLabel
                style={{
                  margin: '10px',
                }}
                labelPlacement="end"
                label="Prevent merge option"
                value={bl.enablePreventMerge}
                control={
                  <Switch
                    color="primary"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlacklists(bls => {
                      const blacklists = [...bls];
                      blacklists[i].enablePreventMerge = e.target.checked;
                      return blacklists;
                    })}
                  />
                }
              />
            </Paper>
          )))
        }
        <Button
          style={{
            width: '100%',
            alignItems: 'center',
            justifyItems: 'center',
            margin: '10px',
          }}
          variant="contained"
          onClick={() => setBlacklists([...blacklists, defaultBlacklist])}
        >
          <Add />
        </Button>
      </FormGroup>
      <div
        style={{
          // marginLeft: "auto",
          margin: '10px 10px 10px 10px',
          float: 'right',
        }}
      >
        <Button
          variant="contained"
          onClick={saveOptions}
          startIcon={<SaveIcon />}
          disabled={hasSaved}
        >
          Save
        </Button>
      </div>
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root')
);
