export const requiredFieldErrorMessage = "required field";

export const andICanClickTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
): void => {
  cy.get(".govuk-back-link").click();
  thenTheUrlShouldContain(previousPageURL);
};

export const whenIClickContinue = (): void =>
  cy.get("button").contains("Continue").click();

export const whenIClickOnFirstErrorSummaryLinkContainingText = (
  text: string
): void => {
  cy.get(".govuk-error-summary__list").within(() => {
    cy.contains(text).click();
  });
};

export const whenIType = (value: string, inputName: string): void => {
  cy.get(`input[name="${inputName}"]`).type(value);
};

export const thenTheUrlShouldContain = (urlPath: string): void => {
  cy.url().should("include", urlPath);
};

export const thenTheInputShouldContain = (
  expectedValue: string,
  inputName: string
): void => {
  cy.get(`input[name="${inputName}"]`).should("contain.value", expectedValue);
};

export const thenIShouldSeeAnErrorSummaryLinkThatContains = (
  errorMessage: string
): void => {
  cy.get(".govuk-error-summary__list").within(() => {
    cy.get("a").should("contain", errorMessage);
  });
};

export const thenIShouldSeeAnErrorMessageThatContains = (
  errorMessage: string
): void => {
  cy.get(".govuk-error-message").should("contain", errorMessage);
};

export const thenMyCursorMovesTo = (elementId: string): void => {
  cy.focused().should("have.attr", "id", elementId);
};
