import { DraftBeaconUse } from "../entities/DraftBeaconUse";

export const prettyUseName = (use: DraftBeaconUse): string =>
  makeEnumValueUserFriendly(use.environment) +
  " - " +
  makeEnumValueUserFriendly(use.activity) +
  (use.purpose ? " (" + makeEnumValueUserFriendly(use.purpose) + ")" : "");

export const ordinal = (number: number): string => {
  const map = {
    1: "main",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth",
  };

  return map[number];
};

/**
 * Convenience function for uppercase a string that could be nullish.
 *
 * @param value {string}   The string value; could be null
 * @returns     {string}   The string value uppercased
 */
export const toUpperCase = (value: string): string => {
  return (value || "").toUpperCase();
};

/**
 * Convenience function for making an enum value, that could be nullish, user friendly i.e. underscores removed and sentence-cased.
 *
 * @param value {string}   The string value; could be null
 * @returns     {string}   The string value made user friendly
 */
export const makeEnumValueUserFriendly = (value: string): string => {
  if (value) {
    value = value.replace(/_/g, " ");
    return sentenceCase(value);
  }
  return value;
};

/**
 * Given the provided string is a number, pads the value with zeros until it reaches the target length.
 *
 * @param value        {string}   The number as a string
 * @param targetLength {number}   The length of the resulting string once the provided value has been padded
 * @returns            {string}   The string value with leading zeros prefixed
 */
export const padNumberWithLeadingZeros = (
  value: string,
  targetLength = 2
): string => {
  const valueAsNumber = parseInt(value);
  if (isNaN(valueAsNumber)) {
    return value;
  }

  return value.padStart(targetLength, "0");
};

export const sentenceCase = (string: string): string =>
  string === undefined
    ? ""
    : string[0].toUpperCase() + string.slice(1).toLowerCase();

export const stringToBoolean = (value: string): boolean =>
  value ? value.toLocaleLowerCase() === "true" : false;

export const joinStrings = (strings: Array<string>): string => {
  const output = [];
  for (let i = 0; i < strings.length; i++) {
    if (strings[i]) output.push(strings[i]);
  }
  return output.join(", ");
};
