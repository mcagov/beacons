import { PageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  andIHaveEnteredNoInformation,
  andIHaveSelected,
  givenIHaveACookieSetAndIVisit,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  whenIClickContinue,
} from "./common.spec";

describe("As a beacon owner, I want to submit the purpose for my beacon", () => {
  it("displays an error if no beacon use purpose is selected", () => {
    givenIAmAnAviationBeaconOwner();
    andIHaveEnteredNoInformation();
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    // TODO: Uncomment below assertions when issue #148 fixed.  Error link
    // should move focus to first radio button.
    //
    // whenIClickOnTheErrorSummaryLinkContaining(
    //   "purpose",
    //   requiredFieldErrorMessage
    // );
    // thenMyFocusMovesTo("#pleasure");
  });
});

const givenIAmAnAviationBeaconOwner = () => {
  givenIHaveACookieSetAndIVisit(PageURLs.environment);
  andIHaveSelected("#aviation");
  andIClickContinue();
};
