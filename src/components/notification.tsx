import Chip from '@mui/material/Chip';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import Alert, { AlertColor } from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import { IBlacklist } from '../options';

export const notificationClassName = 'extensions-notification'; 
export const notificationId = 'extensions-notification';
const mergeBlockCssSelector = '#partial-pull-merging .merge-message .select-menu button'
const disabledClassName = 'extensions-disabled'

interface Props {
  baseBranchName: string;
  baseBranchHref: string;
  headBranchName: string;
  headBranchHref: string;
}


const Notification: React.FC<Props> = (props: Props) => {
  const { baseBranchName, baseBranchHref, headBranchName, headBranchHref } = props;
  const [ severity, setSeverity ] = useState<AlertColor>('info');
  const [ alertMsg, setAlertMsg ] = useState<string>('');

  const chipStyle = {
    fontSize: '1rem',
    boxShadow: '#00000080 3px 3px 3px',
    margin: '0px 5px',
    padding: '0px 10px',
    borderRadius: '5px',
  };

  useEffect(() => {
    chrome?.storage?.sync?.get(['blacklists'], (items) => {
      const bls: IBlacklist[] = items?.blacklists || [];
      let result: AlertColor = 'info';
      bls.some((bl) => {
        const baseRegExp = new RegExp(bl.baseRegExp);
        const headRegExp = new RegExp(bl.headRegExp);
        const isInBLBase = bl.baseRegExp ? baseRegExp.test(baseBranchName) : false;
        const isInBLHead = bl.headRegExp ? headRegExp.test(headBranchName) : false;

        // TODO: Should refactor
        if (bl.baseRegExp && bl.headRegExp) {
          result = isInBLBase && isInBLHead ? 'warning': 'success';
        } else {
          result = isInBLBase || isInBLHead ? 'warning': 'success'
        }
        // once warning is happened, then exit loop
        if (result === 'warning') {
          setAlertMsg(bl.alertMessage);
          if (bl.enablePreventMerge) {
            result = 'error';
            const targetEls = document.querySelectorAll(mergeBlockCssSelector);
            targetEls.forEach((el) => el.classList.add(disabledClassName));
            return true; // exit loop
          }
          return true; // exit loop
        }
      });
      setSeverity(result);
    });
  }, []);

  return (
    <Alert
      suppressHydrationWarning={true}
      variant="filled"
      severity={severity}
      className={notificationClassName}
      style={{
        width: '100%',
        alignItems: 'center',
        borderRadius: '0px 5px',
        overflowX: 'auto',
      }}
    >
      <Stack
        direction={'row'}
        spacing={0.5}
      >
        {
          !!alertMsg &&
            <Typography
              style={{
                fontSize: '0.8rem',
                lineHeight: '26px',
                fontWeight: 600,
                marginRight: '5px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#ffffff',
              }}
            >{alertMsg}</Typography>
        }
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