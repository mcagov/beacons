/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const deepFreeze = (object: any): any => {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
