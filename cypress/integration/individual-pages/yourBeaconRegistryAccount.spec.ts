import { givenIHaveNotSignedIn } from "../common/selectors-and-assertions.spec";

describe("Your beacon registry account", () => {
  it("Redirects the user to the unauthenticated page if the user does not have a valid session", () => {
    givenIHaveNotSignedIn();
    cy.visit("/account/your-beacon-registry-account");
    cy.url().should("contain", ErrorPageURLs.unauthenticated);
  });
});
