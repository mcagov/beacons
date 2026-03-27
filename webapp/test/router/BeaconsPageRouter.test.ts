import { BeaconsPageRouter } from "../../src/router/BeaconsPageRouter";
import { Rule } from "../../src/router/rules/Rule";

const neverMatchingRule = (): Rule => ({
  condition: async () => false,
  action: async () => ({ props: {} }),
});

describe("BeaconsPageRouter", () => {
  it("returns the action result of the first matching rule", async () => {
    const expected = { props: { foo: "bar" } };
    const rule: Rule = {
      condition: async () => true,
      action: async () => expected,
    };

    const result = await new BeaconsPageRouter([rule]).execute();

    expect(result).toBe(expected);
  });

  it("skips non-matching rules and returns the first matching rule's action", async () => {
    const expected = { props: { matched: true } };
    const matchingRule: Rule = {
      condition: async () => true,
      action: async () => expected,
    };

    const result = await new BeaconsPageRouter([
      neverMatchingRule(),
      matchingRule,
    ]).execute();

    expect(result).toBe(expected);
  });

  it("returns a valid object when no rules match, preventing the Next.js getServerSideProps error", async () => {
    const result = await new BeaconsPageRouter([
      neverMatchingRule(),
    ]).execute();

    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining({}));
  });
});
