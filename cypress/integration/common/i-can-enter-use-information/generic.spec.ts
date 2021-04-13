import { Environment } from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveSelected,
  thenTheUrlShouldContain,
} from "../selectors-and-assertions.spec";

export const iCanEditMyEnvironment = (environment: Environment): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};
export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain(PageURLs.additionalUse);
  givenIHaveSelected("#no");
  andIClickContinue();
};
