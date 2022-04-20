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

export const sentenceCase = (string: string): string =>
  string === undefined
    ? ""
    : string[0].toUpperCase() + string.slice(1).toLowerCase();

/**
 * Format a date string as "[D]D <long month name> YYYY".
 *
 * @param dateString
 *
 * See https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style
 */
export const formatDateLong = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatMonth = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export const prettyUseName = (use: Record<string, string>): string =>
  makeEnumValueUserFriendly(use.environment) +
  " - " +
  makeEnumValueUserFriendly(use.activity) +
  (use.purpose ? " (" + makeEnumValueUserFriendly(use.purpose) + ")" : "");
