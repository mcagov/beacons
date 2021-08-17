import { asAnAviationBeaconOwner } from "../common/i-can-enter-beacon-information.spec";
import {
  andIHaveEnteredNoInformation,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenMyFocusMovesTo,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit the purpose for my beacon", () => {
  it("displays an error if no beacon use purpose is selected", () => {
    asAnAviationBeaconOwner();
    andIHaveEnteredNoInformation();
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(
      "purpose",
      requiredFieldErrorMessage
    );
    thenMyFocusMovesTo("#pleasure");
  });
});
