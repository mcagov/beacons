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

/**
 * Convenience function for uppercase a string that could be nullish.
 *
 * @param value {string}   The string value; could be null
 * @returns     {string}   The string value uppercased
 */
export function toUpperCase(value: string): string {
  return (value || "").toUpperCase();
}

/**
 * Given the provided string is a number, pads the value with zeros until it reaches the target length.
 *
 * @param value        {string}   The number as a string
 * @param targetLength {number}   The length of the resulting string once the provided value has been padded
 * @returns            {string}   The string value with leading zeros prefixed
 */
export function padNumberWithLeadingZeros(
  value: string,
  targetLength = 2
): string {
  const valueAsNumber = parseInt(value);
  if (isNaN(valueAsNumber)) {
    return value;
  }

  return value.padStart(targetLength, "0");
}

export type Callback<T> = (t: T) => void;
