import { AccountPageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  andIHaveSelected,
  givenIHaveSignedIn,
  iCanSeeText,
  iHaveClickedOnALinkWithText,
  thenICanSeeAnInputWithPlaceholder,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";

describe("As an AccountHolder", () => {
  it("I can sign out from the 'Your Beacon Registry Account' page", () => {
    givenIHaveSignedIn();
    whenIHaveVisited(AccountPageURLs.accountHome);
    iHaveClickedOnALinkWithText("Sign out");
    iCanSeeText("Start now");

    whenIClickTheButtonContaining("Start now");
    andIHaveSelected("#signIn");
    andIClickContinue();

    thenICanSeeAnInputWithPlaceholder("#email", "Email Address");
    thenICanSeeAnInputWithPlaceholder("#password", "Password");
  });
});
