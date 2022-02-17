export const deepFreeze = <T extends Record<string, any>>(
  object: T
): Readonly<T> => {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
