import Chip from '@mui/material/Chip';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import React from 'react';

export const notificationClassName = 'extensions-notification'; 
export const notificationId = 'extensions-notification'; 

interface Props {
  baseBranchName: string;
  baseBranchHref: string;
  headBranchName: string;
  headBranchHref: string;
}


const Notification: React.FC<Props> = (props: Props) => {
  const { baseBranchName, baseBranchHref, headBranchName, headBranchHref } = props;
  const chipStyle = {
    fontSize: '1rem',
    boxShadow: '#00000080 3px 3px 3px',
    margin: '0px 5px',
    padding: '0px 10px',
    borderRadius: '5px',
  };
  return (
    <Alert
      variant="filled"
      severity="info"
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