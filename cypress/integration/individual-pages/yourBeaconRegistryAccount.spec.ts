import { givenIHaveSignedIn } from "../common/selectors-and-assertions.spec";

describe("Your beacon account registry account page", () => {
  const submissionCookieId = "submissionId";

  it("Sets the cookie for the form submission", () => {
    givenIHaveSignedIn();
    cy.visit("/account/your-beacon-registry-account");
    cy.getCookie(submissionCookieId).should("exist");
  });
});
