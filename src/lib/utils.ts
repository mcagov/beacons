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
 * Convenience function for making an enum value, that could be nullish, user friendly i.e. underscores removed and sentence-cased.
 *
 * @param value {string}   The string value; could be null
 * @returns     {string}   The string value made user friendly
 */
export function makeEnumValueUserFriendly(value: string): string {
  if (value) {
    value = value.replace(/_/g, " ");
    return value[0] + value.slice(1).toLowerCase();
  }
  return value;
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

export function referenceNumber(chars: string, length: number): string {
  let mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  let result = "";
  for (let i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

export function joinStrings(strings: Array<string>): string {
  const output = [];
  for (let i = 0; i < strings.length; i++) {
    if (strings[i]) output.push(strings[i]);
  }
  return output.join(", ");
}

export function formatUrlQueryParams(
  url: string,
  queryParamMap: Record<string, any>
): string {
  const formatUrl = (queryParam, value) => {
    if (!url.includes(queryParam)) {
      const queryStringCombiner = url.includes("?") ? "&" : "?";
      url = `${url}${queryStringCombiner}${queryParam}=${value}`;
    }
  };

  Object.keys(queryParamMap).forEach((queryParam) => {
    const value = queryParamMap[queryParam];
    formatUrl(queryParam, value);
  });

  return url;
}

export function useRankString(number: number): string {
  const map = {
    1: "main",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth",
  };

  return map[number];
}

export type Callback<T> = (t: T) => void;
