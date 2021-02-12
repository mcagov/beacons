export interface ValidatorFunction {
  (fieldValue: string): boolean;
}

export const emptyRequiredField: ValidatorFunction = (value) => !value;

export const isNot15CharactersLong: ValidatorFunction = (value) => {
  return !value || value.length !== 15;
};
