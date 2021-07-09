import { Environment } from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveSelected,
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
  givenIHaveSelected("#yes");
  andIClickContinue();
};

export const iCanEditMyNUses = (n: number): void => {
  iCanSeeNLinksContaining(n, /change/i);
  iCanSeeNLinksContaining(n, /delete/i);
  iCanSeeAButtonContaining(/continue/i);
  iCanSeeAButtonContaining(/add another/i);
};
