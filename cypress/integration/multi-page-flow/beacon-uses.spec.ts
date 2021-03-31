import {
  andIClickContinue,
  givenIAmAt,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
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
  const additionalUseUrl = "/register-a-beacon/additional-beacon-use";
  const aboutTheOwnerUrl = "/register-a-beacon/about-beacon-owner";
  const beaconOwnerAddressUrl = "/register-a-beacon/beacon-owner-address";
  const emergencyContactUrl = "/register-a-beacon/emergency-contact";
  const checkYourAnswersUrl = "/register-a-beacon/check-your-answers";

  describe("adding a beacon use directs me along a page flow relevant to me", () => {
    it("Maritime environment -> Pleasure purpose -> Rowing activity", () => {
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
    });

    it("Maritime environment -> Commercial purpose -> Fishing activity", () => {
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
    });

    it("Aviation environment -> Pleasure purpose -> Jet aircraft activity", () => {
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
    });

    it("Aviation environment -> Commercial purpose -> Passenger plane activity", () => {
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
      givenIHaveTyped("Other details about my use", "#moreDetails");
      whenIClickContinue();

      thenTheUrlShouldContain(additionalUseUrl);
      givenIHaveSelected("#no");
      whenIClickContinue();

      thenTheUrlShouldContain(aboutTheOwnerUrl);
      givenIHaveTyped("Steve Stevington", "#ownerFullName");
      givenIHaveTyped("07283 882733", "#ownerTelephoneNumber");
      givenIHaveTyped("01202 617383", "#ownerAlternativeTelephoneNumber");
      givenIHaveTyped("steve@stevington.com", "#ownerEmail");
      whenIClickContinue();

      thenTheUrlShouldContain(beaconOwnerAddressUrl);
      givenIHaveTyped("42 Steve Street", "#ownerAddressLine1");
      givenIHaveTyped("Plymouth", "#ownerTownOrCity");
      givenIHaveTyped("PL1 3QJ", "#ownerPostcode");
      whenIClickContinue();

      thenTheUrlShouldContain(emergencyContactUrl);
      givenIHaveTyped("Stevetta Stevington", "#emergencyContact1FullName");
      givenIHaveTyped("07253617859", "#emergencyContact1TelephoneNumber");
      givenIHaveTyped(
        "07283918293",
        "#emergencyContact1AlternativeTelephoneNumber"
      );
      givenIHaveTyped("Steveanovna Stevington", "#emergencyContact2FullName");
      givenIHaveTyped("01263827190", "#emergencyContact2TelephoneNumber");
      givenIHaveTyped(
        "07887625362",
        "#emergencyContact2AlternativeTelephoneNumber"
      );
      givenIHaveTyped("Stevelisa Stevington", "#emergencyContact3FullName");
      givenIHaveTyped("07982536271", "#emergencyContact3TelephoneNumber");
      givenIHaveTyped(
        "01928362819",
        "#emergencyContact2AlternativeTelephoneNumber"
      );
      whenIClickContinue();

      thenTheUrlShouldContain(checkYourAnswersUrl);
    });
  });
});
