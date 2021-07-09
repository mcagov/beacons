import {
  AdditionalUses,
  Environment,
} from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveSelected,
  thenTheRadioButtonShouldBeSelected,
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

export const iCanEditMyAdditionalUsesChoice = (
  additionalChoices: AdditionalUses
): void => {
  switch (additionalChoices) {
    case AdditionalUses.YES:
      thenTheRadioButtonShouldBeSelected("#yes");
      break;
    case AdditionalUses.NO:
      thenTheRadioButtonShouldBeSelected("#no");
  }
};
