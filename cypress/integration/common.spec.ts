import { v4 } from "uuid";

export const requiredFieldErrorMessage = "required field";
export const tooManyCharactersErrorMessage = "too many characters";

export const iCanClickTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
): void => {
  cy.get(".govuk-back-link").click();
  thenTheUrlShouldContain(previousPageURL);
};

export const givenIHaveACookieSetAndIVisit = (url: string): void => {
  cy.setCookie("submissionId", v4());
  cy.visit(url);
};

export const givenIAmAt = (url: string): void => {
  cy.visit(url);
};

export const givenIHaveBeenTo = givenIAmAt;
export const andIHaveBeenTo = givenIAmAt;
export const andIAmAt = givenIAmAt;

export const iCanSeeAHeadingThatContains = (text: string): void => {
  cy.get("h1").contains(text);
};

export const whenIClickContinue = (): void => {
  cy.get("button").contains("Continue").click();
};

export const andIClickContinue = whenIClickContinue;

export const whenIClickOnTheErrorSummaryLinkContaining = (
  ...strings: string[]
): void => {
  let link = cy.get(".govuk-error-summary__list");
  strings.forEach((string) => (link = link.contains(string)));
  link.click();
};

export const whenIType = (value: string, selector: string): void => {
  cy.get(selector).clear().type(value);
};

export const givenIHaveTyped = whenIType;
export const andIType = whenIType;

export const thenTheUrlShouldContain = (urlPath: string): void => {
  cy.url().should("include", urlPath);
};

export const thenTheInputShouldContain = (
  expectedValue: string,
  selector: string
): void => {
  cy.get(selector).should("contain.value", expectedValue);
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

export const thenIShouldSeeFormErrors = (...errorMessages: string[]): void => {
  thenIShouldSeeAnErrorSummaryLinkThatContains(...errorMessages);
  thenIShouldSeeAnErrorMessageThatContains(...errorMessages);
};

export const thenMyFocusMovesTo = (selector: string): void => {
  cy.get(selector).should("be.focused");
};

export const givenIHaveSelected = (selector: string): void => {
  cy.get(selector).check();
};
export const andIHaveSelected = givenIHaveSelected;

export const andIHaveEnteredNoInformation = (): void => null;

export const whenIClickBack = (): void => {
  cy.get(".govuk-back-link").click();
};

export const thenTheCheckboxShouldBeChecked = (selector: string): void => {
  cy.get(selector).should("be.checked");
};

export const thenTheRadioButtonShouldBeSelected = thenTheCheckboxShouldBeChecked;

export const thenICannotSee = (selector: string): void => {
  cy.get(selector).should("not.exist");
};

export const thenThereAreNoErrors = (): void => {
  thenICannotSee(".govuk-error-summary");
  thenICannotSee(".govuk-error-message");
};
