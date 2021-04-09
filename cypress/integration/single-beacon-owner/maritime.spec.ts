import { PageURLs } from "../../../src/lib/urls";
import { givenIHaveEnteredMyBeaconDetails } from "../i-can-enter-information";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAHeadingThatContains,
  thenTheCheckboxShouldBeChecked,
  thenTheInputShouldContain,
  thenTheRadioButtonShouldBeSelected,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../selectors-and-assertions.spec";

describe("As a maritime beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveEnteredMyBeaconDetails();

    thenTheUrlShouldContain(PageURLs.environment);
    givenIHaveSelected("#maritime");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("maritime");
    givenIHaveSelected("#pleasure");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("maritime");
    iCanSeeAHeadingThatContains("pleasure");
    givenIHaveSelected("#rowing-vessel");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.aboutTheVessel);
    iCanSeeAHeadingThatContains("vessel");
    givenIHaveTyped("15", "#maxCapacity");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.vesselCommunications);
    givenIHaveSelected("#satelliteTelephone");
    givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.vesselCommunications);
    thenTheCheckboxShouldBeChecked("#satelliteTelephone");
    thenTheInputShouldContain("+881612345678", "#satelliteTelephoneInput");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.aboutTheVessel);
    iCanSeeAHeadingThatContains("vessel");
    thenTheInputShouldContain("15", "#maxCapacity");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("maritime");
    iCanSeeAHeadingThatContains("pleasure");
    thenTheRadioButtonShouldBeSelected("#rowing-vessel");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("maritime");
    thenTheRadioButtonShouldBeSelected("#pleasure");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.environment);
    thenTheRadioButtonShouldBeSelected("#maritime");

    // TODO: Expand testing of this journey to match scope of aviation test file
  });

  it("I can register my beacon for commercial purposes", () => {
    givenIHaveEnteredMyBeaconDetails();

    thenTheUrlShouldContain(PageURLs.environment);
    givenIHaveSelected("#maritime");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("maritime");
    givenIHaveSelected("#commercial");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("maritime");
    iCanSeeAHeadingThatContains("commercial");

    givenIHaveSelected("#fishing-vessel");
    andIClickContinue();
    thenTheUrlShouldContain(PageURLs.aboutTheVessel);
    iCanSeeAHeadingThatContains("vessel");

    givenIHaveTyped("15", "#maxCapacity");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.vesselCommunications);
    givenIHaveSelected("#satelliteTelephone");
    givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.vesselCommunications);
    thenTheCheckboxShouldBeChecked("#satelliteTelephone");
    thenTheInputShouldContain("+881612345678", "#satelliteTelephoneInput");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.aboutTheVessel);
    iCanSeeAHeadingThatContains("vessel");
    thenTheInputShouldContain("15", "#maxCapacity");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("maritime");
    iCanSeeAHeadingThatContains("commercial");
    thenTheRadioButtonShouldBeSelected("#fishing-vessel");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("maritime");
    thenTheRadioButtonShouldBeSelected("#commercial");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.environment);
    thenTheRadioButtonShouldBeSelected("#maritime");

    // TODO: Expand testing of this journey to match scope of aviation test file
  });
});
