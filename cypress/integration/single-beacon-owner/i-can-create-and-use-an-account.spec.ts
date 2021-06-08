import { PageURLs } from "../../../src/lib/urls";
import {
  givenIHaveBeenTo,
  givenIHaveClicked,
  givenIHaveClickedContinue,
  givenIHaveSelected,
  givenIHaveWaitedForAzureB2C,
  iCanSeeAPageHeadingThatContains,
  thenICanSeeAnInputWithPlaceholder,
  thenIShouldSeeAnErrorMessageThatContains,
  thenTheUrlShouldContain,
} from "../common/selectors-and-assertions.spec";

describe("As a new user who wants to register a beacon", () => {
  it("I can create a Beacon Registry Account", () => {
    givenIHaveBeenTo(PageURLs.start);
    givenIHaveClicked(".govuk-button--start");
    givenIHaveSelected("#signUp");
    givenIHaveClickedContinue();
    thenTheUrlShouldContain(
      "b2cmcga.b2clogin.com/B2CMCGA.onmicrosoft.com/B2C_1_singup_beacons"
    );
    thenICanSeeAnInputWithPlaceholder("#email", "Email Address");
    thenICanSeeAnInputWithPlaceholder("#newPassword", "New Password");
    thenICanSeeAnInputWithPlaceholder(
      "#reenterPassword",
      "Confirm New Password"
    );
  });

  it("requires me to choose an option", () => {
    const expectedErrorMessage = "Please select an option";
    givenIHaveBeenTo(PageURLs.start);
    givenIHaveClicked(".govuk-button--start");
    givenIHaveWaitedForAzureB2C();
    givenIHaveClickedContinue();
    thenIShouldSeeAnErrorMessageThatContains(expectedErrorMessage);
  });
});

describe("As user with an account", () => {
  it("I can sign in to my Beacon Registry Account", () => {
    givenIHaveBeenTo(PageURLs.start);
    givenIHaveBeenTo(PageURLs.signUpOrSignIn);
    givenIHaveSelected("#signIn");
    givenIHaveClickedContinue();
    thenTheUrlShouldContain(
      "b2cmcga.b2clogin.com/B2CMCGA.onmicrosoft.com/B2C_1_login_beacons"
    );
    givenIHaveWaitedForAzureB2C();
    iCanSeeAPageHeadingThatContains("Sign In using my Beacon Registry Account");
    thenICanSeeAnInputWithPlaceholder("#email", "Email Address");
    thenICanSeeAnInputWithPlaceholder("#password", "Password");
  });
});
