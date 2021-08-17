import { PageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  givenIAmAt,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  whenIClickOnTheErrorSummaryLinkContaining,
} from "../common/selectors-and-assertions.spec";

describe("Given that I have visited sign-up-or-sign-in", () => {
  it("Displays an error if I have not selected an option", () => {
    givenIAmAt(PageURLs.signUpOrSignIn);
    andIHaveNotSelectedAnOption();
    andIClickContinue();
    thenIShouldSeeFormErrors("Please select an option");

    whenIClickOnTheErrorSummaryLinkContaining("Please select an option");
    thenMyFocusMovesTo("#signIn");
  });
});

const andIHaveNotSelectedAnOption = () => null;
