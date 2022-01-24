import Chip from '@mui/material/Chip';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import Alert, { AlertColor } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import { IBlacklist } from '../options';

export const notificationClassName = 'extensions-notification'; 
export const notificationId = 'extensions-notification';
const githubMergeBtnClassName = 'btn-group-merge';

interface Props {
  baseBranchName: string;
  baseBranchHref: string;
  headBranchName: string;
  headBranchHref: string;
}


const Notification: React.FC<Props> = (props: Props) => {
  const { baseBranchName, baseBranchHref, headBranchName, headBranchHref } = props;
  const [ severity, setSeverity ] = useState<AlertColor>('info');

  const chipStyle = {
    fontSize: '1rem',
    boxShadow: '#00000080 3px 3px 3px',
    margin: '0px 5px',
    padding: '0px 10px',
    borderRadius: '5px',
  };

  useEffect(() => {
    chrome.storage.sync.get(['blacklists'], (items) => {
      const bls: IBlacklist[] = items?.blacklists || [];
      bls.forEach((bl) => {
        console.log(bl);
        const baseRegExp = new RegExp(bl.baseRegExp);
        const headRegExp = new RegExp(bl.headRegExp);
        const isInBLBase = bl.baseRegExp ? baseRegExp.test(baseBranchName) : false;
        const isInBLHead = bl.headRegExp ? headRegExp.test(headBranchName) : false;
        let result: AlertColor = 'info';
        if (bl.baseRegExp && bl.headRegExp) {
          result = isInBLBase && isInBLHead ? 'warning': 'success';
        } else {
          result = isInBLBase || isInBLHead ? 'warning': 'success'
        }
        if (result === 'warning' && bl.enablePreventMerge) {
          result = 'error';
          const targetEls = document.getElementById(githubMergeBtnClassName);
          console.log('Merge btns', targetEls);
        }
        setSeverity(result);
      });
    });
  }, []);

  return (
    <Alert
      variant="filled"
      severity={severity}
      className={notificationClassName}
      style={{
        width: '100%',
        alignItems: 'center',
        borderRadius: '0px 5px',
      }}
    >
      <Stack
        direction={'row'}
        spacing={0.5}
      >
        <Chip
          size="small"
          color='error'
          label={baseBranchName}
          component="a"
          href={baseBranchHref}
          variant="filled"
          clickable
          style={chipStyle}
        />
        <MergeTypeIcon
          style={{
            transform: 'rotate(-90deg)'
          }}
        />
        <Chip
          size="small"
          label={headBranchName}
          component="a"
          href={headBranchHref}
          variant="filled"
          clickable
          style={{
            ...chipStyle,
            color: '#fff',
            backgroundColor: '#999999',
          }}
        />
      </Stack>
    </Alert>
  );
}

export default Notification;