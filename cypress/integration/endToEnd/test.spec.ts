import { PageURLs } from "../../../src/lib/urls";
import { givenIHaveACookieSetAndHaveSignedInIVisit } from "../common/selectors-and-assertions.spec";

describe("As user with an account", () => {
  it("I can sign in to my Beacon Registry Account", () => {
    givenIHaveACookieSetAndHaveSignedInIVisit(PageURLs.accountHome);
  });
});
