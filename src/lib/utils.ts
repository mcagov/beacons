/**
 * Convenience function for converting a single or array of a given type into an array with nullish values removed.
 *
 * @param toConvert {T|T[]}  The value to safe return as an array
 * @returns         {T[]}    An array of the provided values
 */
export function toArray<T>(toConvert: T | T[]): T[] {
  const toArray = toConvert instanceof Array ? toConvert : [toConvert];
  return toArray.filter((value: T) => !!value);
}
