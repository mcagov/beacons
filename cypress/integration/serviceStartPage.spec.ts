describe("Service start page", () => {
  const submissionCookieId = "submissionId";
  it("Vists the service start page", () => {
    cy.visit("/");
    cy.contains("Maritime and Coastguard Agency: Register a beacon").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("Sets the cookie for the form submission", () => {
    cy.visit("/");
    cy.getCookie(submissionCookieId).should("exist");
  });
});
