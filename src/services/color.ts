const stringToNumber = (str: string) => {
  return Array.from(str).map(ch => ch.charCodeAt(0)).reduce((a, b) => a+b);
};

const getColorAngle = (str: string) => {
  const n = stringToNumber(str);
  return (n*n) % 360;  
}

export const getColorFromString = (str: string) => {
  const colorAngle = getColorAngle(str);
  return `hsl(${colorAngle}, 80%, 64%)`;
}
