import { AccountPageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  andIHaveSelected,
  givenIHaveSignedIn,
  iCanSeeAPageHeadingThatContains,
  iCanSeeText,
  iPerformOperationAndWaitForNewPageToLoad,
  thenICanSeeAnInputWithPlaceholder,
  whenIClickTheBrowserBackButton,
  whenIClickTheButtonContaining,
  whenIClickTheLinkThatContains,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";

describe("As an AccountHolder", () => {
  it("I can sign out from the 'Your Beacon Registry Account' page", () => {
    givenIHaveSignedIn();
    whenIHaveVisited(AccountPageURLs.accountHome);
    whenIClickTheLinkThatContains("Sign out");
    iCanSeeAPageHeadingThatContains("Are you sure");

    whenIClickTheLinkThatContains("No");
    iCanSeeAPageHeadingThatContains("Your Beacon Registry Account");

    whenIClickTheLinkThatContains("Sign out");
    iCanSeeAPageHeadingThatContains("Are you sure");

    iPerformOperationAndWaitForNewPageToLoad(() => {
      whenIClickTheButtonContaining("Yes");
    });
    iCanSeeText("Start now");

    whenIClickTheBrowserBackButton();
    iCanSeeText("You must be signed in");

    whenIClickTheButtonContaining("Go to service start page");
    whenIClickTheButtonContaining("Start now");
    andIHaveSelected("#signIn");
    andIClickContinue();

    thenICanSeeAnInputWithPlaceholder("#email", "Email Address");
    thenICanSeeAnInputWithPlaceholder("#password", "Password");
  });
});
