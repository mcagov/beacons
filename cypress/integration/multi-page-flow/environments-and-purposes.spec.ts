import { PageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  andIType,
  givenIAmAt,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common.spec";

describe("As a beacon owner in the maritime environment,", () => {
  const environmentUrl = "/register-a-beacon/beacon-use";
  const purposeUrl = "/register-a-beacon/purpose";
  const activityUrl = "/register-a-beacon/activity";

  const aboutTheVesselUrl = "/register-a-beacon/about-the-vessel";
  const aboutTheAircraftUrl = "/register-a-beacon/about-the-aircraft";

  const vesselCommunicationsUrl = "/register-a-beacon/vessel-communications";
  const aircraftCommunicationsUrl =
    "/register-a-beacon/aircraft-communications";

  const moreDetailsUrl = "/register-a-beacon/more-details";

  describe("adding a beacon use directs me along a page flow relevant to me", () => {
    it("Maritime environment -> Pleasure purpose", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#maritime");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");

      givenIHaveSelected("#pleasure");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("pleasure");

      givenIHaveSelected("#rowing-vessel");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");

      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();
      thenTheUrlShouldContain(vesselCommunicationsUrl);

      thenTheUrlShouldContain(vesselCommunicationsUrl);
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

      thenTheUrlShouldContain(moreDetailsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(vesselCommunicationsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");
      whenIClickBack();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("pleasure");
      whenIClickBack();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");
      whenIClickBack();

      thenTheUrlShouldContain(environmentUrl);
    });

    it("Maritime environment -> Commercial purpose", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#maritime");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");

      givenIHaveSelected("#commercial");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("commercial");

      givenIHaveSelected("#fishing-vessel");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");

      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();

      thenTheUrlShouldContain(vesselCommunicationsUrl);
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

      thenTheUrlShouldContain(moreDetailsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(vesselCommunicationsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");
      whenIClickBack();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("commercial");
      whenIClickBack();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");
      whenIClickBack();

      thenTheUrlShouldContain(environmentUrl);
    });

    it("Aviation environment -> Pleasure purpose", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#aviation");
      andIClickContinue();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");
      givenIHaveSelected("#pleasure");
      andIClickContinue();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("pleasure");
      givenIHaveSelected("#jet-aircraft");
      andIClickContinue();

      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();

      thenTheUrlShouldContain(aircraftCommunicationsUrl);
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

      thenTheUrlShouldContain(moreDetailsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aircraftCommunicationsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
      whenIClickBack();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("pleasure");
      whenIClickBack();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");
      whenIClickBack();

      thenTheUrlShouldContain(environmentUrl);
    });

    it("Aviation environment -> Commercial purpose", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#aviation");
      andIClickContinue();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");
      givenIHaveSelected("#commercial");
      andIClickContinue();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("commercial");
      givenIHaveSelected("#passenger-plane");
      andIClickContinue();

      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
      givenIHaveTyped("15", "#maxCapacity");
      andIClickContinue();

      thenTheUrlShouldContain(aircraftCommunicationsUrl);
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

      thenTheUrlShouldContain(moreDetailsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aircraftCommunicationsUrl);
      whenIClickBack();

      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
      whenIClickBack();

      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("commercial");
      whenIClickBack();

      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");
      whenIClickBack();

      thenTheUrlShouldContain(environmentUrl);
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

      thenTheUrlShouldContain(environmentUrl);
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

      thenTheUrlShouldContain(environmentUrl);
    });
  });
});
