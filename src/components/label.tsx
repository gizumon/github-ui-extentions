import React from 'react';

export const labelClassName = 'extensions-label'; 

interface Props {
  pullReqId: string;
}

const Label: React.FC<Props> = ({ pullReqId }: Props) => {
  console.log(pullReqId)
  return (
    <div className={labelClassName}>This is test label</div>
  );
}

export default Label;