export const requiredFieldErrorMessage = "required field";

export const andICanClickTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
): void => {
  cy.get(".govuk-back-link").click();
  thenTheUrlShouldContain(previousPageURL);
};

export const whenIClickContinue = (): void =>
  cy.get("button").contains("Continue").click();

export const whenIClickOnTheErrorSummaryLinkContainingText = (
  ...strings: string[]
): void => {
  let link = cy.get(".govuk-error-summary__list");
  strings.forEach((string) => (link = link.contains(string)));
  link.click();
};

export const whenIType = (value: string, inputName: string): void => {
  cy.get(`input[name="${inputName}"]`).clear().type(value);
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
  ...strings: string[]
): void => {
  cy.get(".govuk-error-summary__list").within(() => {
    strings.every((string) => cy.get("a").should("contain", string));
  });
};

export const thenIShouldSeeAnErrorMessageThatContains = (
  ...strings: string[]
): void => {
  strings.every((string) =>
    cy.get(".govuk-error-message").should("contain", string)
  );
};

export const thenMyCursorMovesTo = (elementId: string): void => {
  cy.focused().should("have.attr", "id", elementId);
};
