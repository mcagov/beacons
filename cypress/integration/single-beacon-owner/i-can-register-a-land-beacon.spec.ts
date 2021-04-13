import { PageURLs } from "../../../src/lib/urls";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import {
  andIClickContinue,
  andIType,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  thenTheCheckboxShouldBeChecked,
  thenTheInputShouldContain,
  thenTheRadioButtonShouldBeSelected,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common/selectors-and-assertions.spec";

describe("As a land beacon owner,", () => {
  it("I can register my beacon", () => {
    givenIHaveEnteredMyBeaconDetails();

    thenTheUrlShouldContain(PageURLs.environment);
    givenIHaveSelected("#land");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.landOtherActivity);
    givenIHaveSelected("#cycling");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.landOtherCommunications);
    givenIHaveSelected("#portableVhfRadio");
    andIType("235 762000", "#portableVhfRadioInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.landOtherCommunications);
    thenTheCheckboxShouldBeChecked("#portableVhfRadio");
    thenTheInputShouldContain("235 762000", "#portableVhfRadioInput");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.landOtherActivity);
    thenTheCheckboxShouldBeChecked("#cycling");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.environment);
    thenTheRadioButtonShouldBeSelected("#land");

    // TODO: Expand testing of this journey to match scope of aviation test file
  });

  it("Other environment", () => {
    givenIHaveACookieSetAndIVisit(PageURLs.environment);
    givenIHaveSelected("#other");
    andIType("My spaceship, the Heart of Gold", "#environmentOtherInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.landOtherActivity);
    givenIHaveSelected("#cycling");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.landOtherCommunications);
    givenIHaveSelected("#portableVhfRadio");
    andIType("235 762000", "#portableVhfRadioInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.landOtherCommunications);
    thenTheCheckboxShouldBeChecked("#portableVhfRadio");
    thenTheInputShouldContain("235 762000", "#portableVhfRadioInput");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.landOtherActivity);
    thenTheCheckboxShouldBeChecked("#cycling");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.environment);
    thenTheRadioButtonShouldBeSelected("#other");

    // TODO: Expand testing of this journey to match scope of aviation test file
  });
});
