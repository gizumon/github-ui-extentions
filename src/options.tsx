import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, createTheme, FormControlLabel, FormGroup, FormLabel, IconButton, Paper, Stack, Switch, ThemeProvider, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Info } from '@mui/icons-material';

const enabledGitHubURLSettingFeature = false;

export interface IBlacklist {
  baseRegExp: string;
  headRegExp: string;
  alertMessage: string;
  enablePreventMerge: boolean;
}

const defaultBlacklist = {
  baseRegExp: '',
  headRegExp: '',
  alertMessage: '',
  enablePreventMerge: false,
}

const examples = [{
  title: 'Alert merging into "master" branch',
  baseRegExp: '^master$',
  headRegExp: '*',
  alertMessage: 'NOTE: This branch will merge into "master" branch!!!',
  enablePreventMerge: false,
},{
  title: 'Prevent merging from "master" branch',
  baseRegExp: '*',
  headRegExp: '^master$',
  alertMessage: 'ERROR: Should not merge from "master" branch!!!',
  enablePreventMerge: true,
},{
  title: 'Alert for merging into "develop" branch from "feature/*" branch',
  baseRegExp: '^develop$',
  headRegExp: '^feature/.+',
  alertMessage: 'NOTE: Please make sure the source branch is correct!!!',
  enablePreventMerge: false,
}];

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const Options = () => {
  const [hasSaved, setHasSaved] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [blacklists, setBlacklists] = useState<IBlacklist[]>([]);

  useEffect(() => {
    chrome?.storage?.sync?.get(['blacklists'], (items) => {
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
        minWidth: '700px',
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
              <Info
                color='info'
                onClick={() => setShowInfo((pre) => !pre)}
              />
            </IconButton>
          </Tooltip>
        </FormLabel>
        {
          showInfo &&
            <ThemeProvider theme={darkTheme}>
              <Paper
                style={{ margin: '10px' }}
                elevation={3}
              >
                <Box margin='10px'>
                  {
                    examples.map((example, i) => (
                      <Paper
                        style={{ margin: '15px 10px' }}
                        elevation={24}
                      >
                        <Typography
                          margin='5px'
                        >
                          Example {i + 1}. {example.title}
                        </Typography>
                        <TextField
                          label="Base branch regexp (target)"
                          size="small"
                          defaultValue={example.baseRegExp}
                          disabled
                        />
                        <TextField
                          label="Head branch regexp (source)"
                          size="small"
                          defaultValue={example.headRegExp}
                          disabled
                        />
                        <TextField
                          label="Alert message"
                          size="small"
                          defaultValue={example.alertMessage}
                          disabled
                        />
                        <FormControlLabel
                          style={{
                            margin: '0px 5px',
                          }}
                          labelPlacement="end"
                          label="Strict error option (prevent the merge)"
                          control={
                            <Switch
                              color="primary"
                              checked={example.enablePreventMerge}
                              disabled
                            />
                          }
                        />
                      </Paper>
                    ))
                  }
                </Box>
              </Paper>
            </ThemeProvider>
        }
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
                label="Base branch regexp (target)"
                size="small"
                placeholder="If empty, then ignore the base branch check"
                defaultValue={bl.baseRegExp}
                value={bl.baseRegExp}
                onChange={(e) => setBlacklists(bls => {
                  const blacklists = [...bls];
                  blacklists[i].baseRegExp = e.target.value;
                  return blacklists;
                })}
              />
              <TextField
                label="Head branch regexp (source)"
                size="small"
                placeholder="If empty, then ignore the head branch check"
                defaultValue={bl.headRegExp}
                value={bl.headRegExp}
                onChange={(e) => setBlacklists(bls => {
                  const blacklists = [...bls];
                  blacklists[i].headRegExp = e.target.value;
                  return blacklists;
                })}
              />
              <TextField
                label="Alert message"
                size="small"
                placeholder="If the above checks cannot be passed, then will show this alert message"
                defaultValue={bl.alertMessage}
                value={bl.alertMessage}
                onChange={(e) => setBlacklists(bls => {
                  const blacklists = [...bls];
                  blacklists[i].alertMessage = e.target.value;
                  return blacklists;
                })}
              />
              <FormControlLabel
                style={{
                  margin: '10px',
                }}
                labelPlacement="end"
                label="Strict error option (prevent the merge)"
                value={bl.enablePreventMerge}
                defaultChecked={bl.enablePreventMerge}
                control={
                  <Switch
                    color="primary"
                    checked={bl.enablePreventMerge}
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
            width: 'calc(100% - 20px)',
            alignItems: 'center',
            justifyItems: 'center',
            margin: '20px 10px 10px 10px',
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
          margin: '0px 10px 20px 10px',
          float: 'right',
        }}
      >
        <Button
          variant="contained"
          color="success"
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
