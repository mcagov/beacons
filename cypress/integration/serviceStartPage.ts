import {} from "cypress";

describe("Service start page", () => {
  it("Vists the service start page", () => {
    cy.visit("/");
    cy.contains("Maritime and Coastguard Agency: Register a beacon").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
