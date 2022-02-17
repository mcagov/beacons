const re = new RegExp(/none/i);

export const replaceNone = (field: string): string => {
  return re.test(field) ? "N/A" : field;
};
