export interface ValidatorFunction {
  (fieldValue: string): boolean;
}

export const emptyRequiredField: ValidatorFunction = (value) => !value;

export const containsNonHexChar: ValidatorFunction = (value) => {
  const regex = /[0-9A-Fa-f]/g;
  return regex.test(value);
};
