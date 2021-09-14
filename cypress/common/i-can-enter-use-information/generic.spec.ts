import { Environment } from "../../../src/lib/deprecatedRegistration/types";
import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  andIClickTheButtonContaining,
  iCanSeeAButtonContaining,
  iCanSeeNLinksContaining,
  iHaveClickedOnAGivenLink,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../selectors-and-assertions.spec";

export const iCanEditMyEnvironment = (environment: Environment): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};

export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain(CreateRegistrationPageURLs.additionalUse);
  andIClickContinue();
};

export const andIHaveAnotherUse = (): void => {
  andIClickTheButtonContaining("Add another");
  iShouldBeEditingAFreshUse();
};

export const givenIHaveAnotherUse = andIHaveAnotherUse;

export const whenIHaveAnotherUse = andIHaveAnotherUse;

const iShouldBeEditingAFreshUse = (): void => {
  cy.get('[type="radio"]').should("not.be.checked");
};

export const iCanEditMyNUses = (n: number): void => {
  iCanSeeNLinksContaining(n, "Change");
  iCanSeeNLinksContaining(n, "Delete");
  iCanSeeAButtonContaining("Continue");
  iCanSeeAButtonContaining("Add another");
};

export const iAmEditingTheCorrectUse = (href1: string, href2: string): void => {
  iHaveClickedOnAGivenLink(href1);
  whenIClickContinue();
  thenTheUrlShouldContain(href2);
};
