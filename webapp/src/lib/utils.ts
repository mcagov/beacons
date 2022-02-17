// Low-level utility functions that could be considered an extension of the JavaScript API.  No domain logic.
import * as _ from "lodash";

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

export type Callback<T> = (t: T) => void;

export const diffObjValues = <T>(base: T, comparator: T): T => {
  if (noRecursionNeeded(base, comparator)) return comparator;

  return Object.keys(comparator).reduce((diff: Record<any, any>, key) => {
    if (_.isEqual(comparator[key], base[key])) return diff;
    /* eslint-disable no-prototype-builtins */
    if (!base.hasOwnProperty(key))
      throw ReferenceError(`Comparator key ${key} not found on base`);

    diff[key] = diffObjValues(base[key], comparator[key]);

    return diff;
  }, {});
};

const noRecursionNeeded = (base: any, comparator: any) =>
  !isRecord(base) && !isRecord(comparator);

const isRecord = (object: any) =>
  typeof object === "object" && !isArray(object);

const isArray = (object: any) => object instanceof Array;
