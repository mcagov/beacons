import { RedirectUserTo } from "../../src/useCases/redirectUserTo";

describe("RedirectUserTo", () => {
  it("should return a redirect to the provided url", () => {
    const useCase = new RedirectUserTo();
    const redirectUrl = "/";
    const redirect = useCase.execute(redirectUrl);
    expect(redirect.redirect.destination).toBe(redirectUrl);
  });
});
