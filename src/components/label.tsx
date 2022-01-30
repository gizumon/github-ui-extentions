import { Chip, Stack } from '@mui/material';
import React from 'react';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import { getColorFromString } from '../services/color';
export const labelClassName = 'extensions-label';

interface Props {
  pullReqId: string;
  headRef?: string;
  baseRef?: string;
  headHref?: string;
  baseHref?: string;
};

const chipStyle = {
  fontSize: '12px',
  fontWeight: '600',
  boxShadow: '#00000080 3px 3px 3px',
  margin: '0px 5px',
  padding: '0px 4px',
  borderRadius: '5px',
};

const Label: React.FC<Props> = ({ pullReqId, headRef, baseRef, headHref, baseHref }: Props) => {
  if (!(headRef && baseRef && headHref && baseHref)) {
    return (<></>)
  }
  return (
    <Stack
      className={labelClassName}
      direction={'row'}
      spacing={0.5}
      style={{
        padding: '2px 0px 0px 5px',
      }}
    >
      <Chip
        size="small"
        label={headRef}
        component="a"
        href={headHref}
        variant="filled"
        clickable
        style={{
          ...chipStyle,
          backgroundColor: `${getColorFromString(headRef)}`,
        }}
        sx={{
          '&> span': {
            color: `${getColorFromString(headRef)}`,
            filter: 'invert(100%) grayscale(100%) contrast(100)',  
          },
        }}
      />
      <MergeTypeIcon
        style={{
          transform: 'rotate(-90deg)'
        }}
      />
      <Chip
        size="small"
        label={baseRef}
        component="a"
        href={baseHref}
        variant="filled"
        clickable
        style={{
          ...chipStyle,
          backgroundColor: `${getColorFromString(baseRef)}`,
        }}
        sx={{
          '&> span': {
            color: `${getColorFromString(baseRef)}`,
            filter: 'invert(100%) grayscale(100%) contrast(100)',  
          },
        }}
      />
    </Stack>
  );
}

export default Label;