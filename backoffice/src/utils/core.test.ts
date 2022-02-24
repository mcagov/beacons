import { diffObjValues } from "./core";

describe("diffObjValues()", () => {
  const testCases = [
    {
      base: {},
      comparator: {},
      expectedOutput: {},
      description: "when passed an empty object returns an empty object",
    },
    {
      base: { a: "b" },
      comparator: { a: "b" },
      expectedOutput: {},
      description: "when passed two identical objects, returns an empty object",
    },
    {
      base: { a: "b" },
      comparator: { a: "c" },
      expectedOutput: { a: "c" },
      description:
        "when passed two different objects, returns the changed properties",
    },
    {
      base: { a: "b", b: "d" },
      comparator: { a: "c", b: "e" },
      expectedOutput: { a: "c", b: "e" },
      description:
        "when passed two other different objects, returns the changed properties",
    },
    {
      base: { a: "b", c: { d: "e" } },
      comparator: { a: "b", c: { d: "f" } },
      expectedOutput: { c: { d: "f" } },
      description:
        "when passed a deep object, returns the changed properties all the way down",
    },
    {
      base: { a: "b", c: { d: "e", f: "g" } },
      comparator: { a: "b", c: { d: "e", f: "h" } },
      expectedOutput: { c: { f: "h" } },
      description:
        "when passed another deep object, returns the changed properties all the way down",
    },
    {
      base: { a: "b", c: { d: "e", f: { g: "h" } } },
      comparator: { a: "b", c: { d: "e", f: { g: "i" } } },
      expectedOutput: { c: { f: { g: "i" } } },
      description:
        "when passed a three-deep object, returns the changed properties all the way down",
    },
    {
      base: { a: [1, 2, 3] },
      comparator: { a: [4, 5, 6] },
      expectedOutput: { a: [4, 5, 6] },
      description: "handles arrays",
    },
    {
      base: { a: [1, 2, 3], b: "c" },
      comparator: { a: [1, 2, 3], b: [4, 5, 6] },
      expectedOutput: { b: [4, 5, 6] },
      description: "handles other arrays",
    },
    {
      base: { a: undefined, c: "d" },
      comparator: { a: "b", c: "d" },
      expectedOutput: { a: "b" },
      description: "handles undefined",
    },
    {
      base: { a: "b" },
      comparator: { a: "" },
      expectedOutput: { a: "" },
      description: "handles empty strings",
    },
    {
      base: { a: { b: "c" } },
      comparator: { a: { b: "" } },
      expectedOutput: { a: { b: "" } },
      description: "handles nested empty strings",
    },
    {
      base: { a: { b: "c" } },
      comparator: { a: { b: "" } },
      expectedOutput: { a: { b: "" } },
      description: "handles nested empty strings",
    },
    {
      base: { a: { b: "c" }, d: "e" },
      comparator: { a: { b: "" }, d: "" },
      expectedOutput: { a: { b: "" }, d: "" },
      description: "handles more nested empty strings",
    },
  ];

  testCases.forEach((test) => {
    it(`${test.description}`, () => {
      expect(diffObjValues(test.base, test.comparator)).toStrictEqual(
        test.expectedOutput
      );
    });
  });

  it("when passed a comparator with a different key to the base, throws an error", () => {
    const base = { a: "b", b: "d" };
    const comparator = { a: "c", f: "e" };

    const diffIncomparableObjects = () => diffObjValues(base, comparator);

    expect(diffIncomparableObjects).toThrowError();
  });
});
