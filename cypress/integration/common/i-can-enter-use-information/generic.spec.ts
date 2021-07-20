import { Environment } from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import {
  andIClickContinue,
  andIClickTheButtonContaining,
  iCanSeeAButtonContaining,
  iCanSeeNLinksContaining,
  thenTheUrlShouldContain,
} from "../selectors-and-assertions.spec";

export const iCanEditMyEnvironment = (environment: Environment): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};

export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain(PageURLs.additionalUse);
  andIClickContinue();
};

export const andIHaveAnotherUse = (): void => {
  thenTheUrlShouldContain(PageURLs.additionalUse);
  andIClickTheButtonContaining("Add another");
  iShouldBeEditingAFreshUse();
};

const iShouldBeEditingAFreshUse = (): void => {
  cy.get('[type="radio"]').should("not.be.checked");
};

export const givenIHaveAnotherUse = andIHaveAnotherUse;

export const iCanEditMyNUses = (n: number): void => {
  iCanSeeNLinksContaining(n, "Change");
  iCanSeeNLinksContaining(n, "Delete");
  iCanSeeAButtonContaining("Continue");
  iCanSeeAButtonContaining("Add another");
};
