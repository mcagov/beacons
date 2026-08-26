import { BeaconsPageRouter } from "../../src/router/BeaconsPageRouter";
import { Rule } from "../../src/router/rules/Rule";

describe("BeaconsPageRouter", () => {
  const ruleThat = (matches: boolean, result: any = { props: {} }): Rule => ({
    condition: jest.fn().mockResolvedValue(matches),
    action: jest.fn().mockResolvedValue(result),
  });

  it("executes the action of the first rule whose condition is met", async () => {
    const expected = { props: { showCookieBanner: true } };
    const skipped = ruleThat(false);
    const laterMatch = ruleThat(true, { props: { wrong: true } });

    const result = await new BeaconsPageRouter([
      skipped,
      ruleThat(true, expected),
      laterMatch,
    ]).execute();

    expect(result).toEqual(expected);
    expect(skipped.action).not.toHaveBeenCalled();
    expect(laterMatch.action).not.toHaveBeenCalled();
  });

  it("returns not found when no rule matches, rather than undefined", async () => {
    const result = await new BeaconsPageRouter([
      ruleThat(false),
      ruleThat(false),
    ]).execute();

    expect(result).toEqual({ notFound: true });
  });

  it("returns not found when there are no rules at all", async () => {
    const result = await new BeaconsPageRouter([]).execute();

    expect(result).toEqual({ notFound: true });
  });
});
