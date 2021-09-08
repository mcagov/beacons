import { AccountPageURLs } from "../../../src/lib/urls";
import { givenIAmAt } from "../../common/selectors-and-assertions.spec";
describe("Cookie banner", () => {
  it("given the user has clicked to hide the cookie banner, it should not be displayed on the sign up or in page", () => {
    givenIAmAt(AccountPageURLs.signUpOrSignIn);

    cy.get("button")
      .contains(/hide this message/i)
      .click();

    cy.contains(/cookies on maritime and coastguard agency/i).should(
      "not.exist"
    );
  });
});
