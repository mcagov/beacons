import { RedirectTo } from "../../src/useCases/redirectTo";

describe("RedirectTo", () => {
  it("should return a redirect to the provided url", () => {
    const useCase = new RedirectTo();
    const redirectUrl = "/";
    const redirect = useCase.execute(redirectUrl);
    expect(redirect.redirect.destination).toBe(redirectUrl);
  });
});
