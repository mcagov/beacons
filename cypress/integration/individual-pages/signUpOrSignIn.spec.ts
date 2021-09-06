import {
  andIClickContinue,
  givenIAmAt,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  whenIClickOnTheErrorSummaryLinkContaining,
} from "../common/selectors-and-assertions.spec";

describe("Given that I have visited sign-up-or-sign-in", () => {
  it("Displays an error if I have not selected an option", () => {
    const errorMessage = "Select an option to sign in or to create an account";
    givenIAmAt(AccountAccountAccountPageURLs.signUpOrSignIn);
    andIHaveNotSelectedAnOption();
    andIClickContinue();
    thenIShouldSeeFormErrors(errorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(errorMessage);
    thenMyFocusMovesTo("#signIn");
  });
});

const andIHaveNotSelectedAnOption = () => null;
