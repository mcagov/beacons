/**
 * Convenience function for converting a single or array of a given type into an array with nullish values removed.
 *
 * @param toConvert {T|T[]}  The value to safe return as an array
 * @returns         {T[]}    An array of the provided values
 */
export function toArray<T>(toConvert: T | T[]): T[] {
  const toReturn = toConvert instanceof Array ? toConvert : [toConvert];
  return toReturn.filter((value: T) => !!value);
}

export const ensureFormDataHasKeys = (
  formData: Record<string, string>,
  ...keys: string[]
): Record<string, string> => {
  const newFormData = { ...formData };
  keys.forEach((key: string) => {
    if (!newFormData[key]) {
      newFormData[key] = "";
    }
  });

  return newFormData;
};

export type Callback<T> = (t: T) => void;
