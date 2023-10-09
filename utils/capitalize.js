export const capitalize = (string) => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export const addSpaceToCaps = (string) => {
  let str = "";
  const chars = string.split("");
  for (const char of chars) {
    str += char === char.toUpperCase() ? ` ${char}` : char;
  }
  return str;
};
