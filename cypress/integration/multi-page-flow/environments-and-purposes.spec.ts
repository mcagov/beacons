import { PageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  andIType,
  givenIAmAt,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAHeadingThatContains,
  thenTheCheckboxShouldBeChecked,
  thenTheInputShouldContain,
  thenTheRadioButtonShouldBeSelected,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common.spec";

describe("As a beacon owner in the maritime environment,", () => {
  describe("adding a beacon use directs me along a page flow relevant to me", () => {
    it("Maritime environment -> Pleasure purpose", () => {
      givenIAmAt(PageURLs.environment);
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
    });

    it("Maritime environment -> Commercial purpose", () => {
      givenIAmAt(PageURLs.environment);
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
      givenIHaveSelected("#vhfRadio");
      givenIHaveSelected("#satelliteTelephone");
      givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
      givenIHaveSelected("#mobileTelephone");
      givenIHaveTyped("07826372833", "#mobileTelephoneInput1");
      givenIHaveSelected("#otherCommunication");
      givenIHaveTyped(
        "You can reach me by smoke signal, carrier pigeon or cup-and-string",
        "#otherCommunicationInput"
      );
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.moreDetails);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.vesselCommunications);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.aboutTheVessel);
      iCanSeeAHeadingThatContains("vessel");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.activity);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("commercial");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.purpose);
      iCanSeeAHeadingThatContains("maritime");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.environment);
    });

    it("Aviation environment -> Pleasure purpose", () => {
      givenIAmAt(PageURLs.environment);
      givenIHaveSelected("#aviation");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.purpose);
      iCanSeeAHeadingThatContains("aviation");
      givenIHaveSelected("#pleasure");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.activity);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("pleasure");
      givenIHaveSelected("#jet-aircraft");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
      iCanSeeAHeadingThatContains("aircraft");
      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.aircraftCommunications);
      givenIHaveSelected("#vhfRadio");
      givenIHaveSelected("#satelliteTelephone");
      givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
      givenIHaveSelected("#mobileTelephone");
      givenIHaveTyped("07826372833", "#mobileTelephoneInput1");
      givenIHaveSelected("#otherCommunication");
      givenIHaveTyped(
        "You can reach me by smoke signal, carrier pigeon or cup-and-string",
        "#otherCommunicationInput"
      );
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.moreDetails);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.aircraftCommunications);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
      iCanSeeAHeadingThatContains("aircraft");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.activity);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("pleasure");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.purpose);
      iCanSeeAHeadingThatContains("aviation");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.environment);
    });

    it("Aviation environment -> Commercial purpose", () => {
      givenIAmAt(PageURLs.environment);
      givenIHaveSelected("#aviation");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.purpose);
      iCanSeeAHeadingThatContains("aviation");
      givenIHaveSelected("#commercial");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.activity);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("commercial");
      givenIHaveSelected("#passenger-plane");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
      iCanSeeAHeadingThatContains("aircraft");
      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.aircraftCommunications);
      givenIHaveSelected("#vhfRadio");
      givenIHaveSelected("#satelliteTelephone");
      givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
      givenIHaveSelected("#mobileTelephone");
      givenIHaveTyped("07826372833", "#mobileTelephoneInput1");
      givenIHaveSelected("#otherCommunication");
      givenIHaveTyped(
        "You can reach me by smoke signal, carrier pigeon or cup-and-string",
        "#otherCommunicationInput"
      );
      andIClickContinue();

      thenTheUrlShouldContain(PageURLs.moreDetails);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.aircraftCommunications);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
      iCanSeeAHeadingThatContains("aircraft");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.activity);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("commercial");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.purpose);
      iCanSeeAHeadingThatContains("aviation");
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.environment);
    });

    it("Land environment", () => {
      givenIAmAt(PageURLs.environment);
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
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.landOtherActivity);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.environment);
    });

    it("Other environment", () => {
      givenIAmAt(PageURLs.environment);
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
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.landOtherActivity);
      whenIClickBack();

      thenTheUrlShouldContain(PageURLs.environment);
    });
  });
});
