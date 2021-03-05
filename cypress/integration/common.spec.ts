export const requiredFieldErrorMessage = "required field";

export const andICanUseTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
) => {
  cy.get(".govuk-back-link")
    .should("have.attr", "href", previousPageURL)
    .contains("Back");
};

export const whenIClickContinue = () =>
  cy.get("button").contains("Continue").click();

export const thenTheUrlShouldContain = (urlPath: string) => {
  cy.url().should("include", urlPath);
};

export const thenTheInputShouldContain = (
  expectedValue: string,
  inputName: string
) => {
  cy.get(`input[name="${inputName}"]`).should("contain.value", expectedValue);
};

export const thenIShouldSeeAnErrorMessageThatContains = (
  errorMessage: string
) => {
  cy.get("a").should("contain", errorMessage);
};

export const whenIType = (value: string, inputName: string) => {
  cy.get(`input[name="${inputName}"]`).type(value);
};
