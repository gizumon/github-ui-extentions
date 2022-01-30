import Chip from '@mui/material/Chip';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import Alert, { AlertColor } from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import { IBlacklist } from '../options';
import { Checkbox } from '@mui/material';
import { disabledClassName, disabledElementsByClassName, enabledElementsByClassName, hasElementAdded } from '../services/element';

export const notificationClassName = 'extensions-notification'; 
export const notificationId = 'extensions-notification';
const mergeBlockCssSelector = '#partial-pull-merging .merge-message .select-menu button, #partial-pull-merging .merge-message .select-menu summary'
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
  const [ hasChecked, setHasChecked ] = useState<boolean>(false);

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
      let status: AlertColor = 'info';
      bls.filter(bl => (!!bl.baseRegExp || !!bl.headRegExp)).some((bl) => {
        status = getAlertStatus(baseBranchName, headBranchName, bl);

        if (status === 'success') {
          return false; // continue
        }
        if (status === 'error') {
          disabledElementsByClassName(mergeBlockCssSelector);
        }
        // warning or error
        setAlertMsg(bl.alertMessage);
        return true; // exit loop
      });
      setSeverity(status);
    });
  }, []);

  useEffect(() => {
    if (severity !== 'error') {
      return;
    }
    if (hasChecked) {
      hasElementAdded(disabledClassName) && enabledElementsByClassName(mergeBlockCssSelector);
    } else {
      !hasElementAdded(disabledClassName) && disabledElementsByClassName(mergeBlockCssSelector);
    }
  }, [hasChecked]);

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
          severity === 'error' && 
          <Checkbox
            style={{
              float: 'left',
              color: '#ffffff',
              padding: 0,
            }}
            checked={hasChecked}
            onChange={() => setHasChecked(!hasChecked)}
          />
        }
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

const getAlertStatus = (
  baseBranchName: string,
  headBranchName: string,
  { baseRegExp, headRegExp, enablePreventMerge }: IBlacklist,
): AlertColor => {
  // if empty, then always block
  const isBaseIncludedBL = baseRegExp ? new RegExp(baseRegExp).test(baseBranchName) : true;
  const isHeadIncludedBL = headRegExp ? new RegExp(headRegExp).test(headBranchName) : true;
  const isSuccess = !isBaseIncludedBL || !isHeadIncludedBL;
  if (isSuccess) {
    return 'success';
  }
  if (enablePreventMerge) {
    return 'error';
  }
  return 'warning';
}

export default Notification;
