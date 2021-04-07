import { PageURLs } from "../../../src/lib/urls";
import { testAviationPleasureUse } from "../happy-path-test-data.spec";
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
import {
  givenIHaveEnteredInformationAboutMyAircraft,
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyAircraftCommunicationDetails,
  givenIHaveEnteredMyBeaconDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
} from "../user-enters-information.spec";
import {
  iCanSeeMyAviationPleasureUse,
  iCanSeeMyBeaconInformation,
} from "../user-sees-previously-entered-information.spec";

describe("As an aviation beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveEnteredMyBeaconDetails();

    thenTheUrlShouldContain(PageURLs.environment);
    givenIHaveSelected("#aviation");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("aviation");
    givenIHaveSelected("#pleasure");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("aviation");
    iCanSeeAHeadingThatContains("pleasure");
    givenIHaveSelected("#" + testAviationPleasureUse.activity.toLowerCase());
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
    iCanSeeAHeadingThatContains("aircraft");
    givenIHaveEnteredInformationAboutMyAircraft();
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.aircraftCommunications);
    givenIHaveEnteredMyAircraftCommunicationDetails();
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    givenIHaveTyped("X", "#moreDetails");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.additionalUse);
    givenIHaveSelected("#no");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.aboutBeaconOwner);
    givenIHaveEnteredMyPersonalDetails();

    thenTheUrlShouldContain(PageURLs.beaconOwnerAddress);
    givenIHaveEnteredMyAddressDetails();

    thenTheUrlShouldContain(PageURLs.emergencyContact);
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconInformation();
    iCanSeeMyAviationPleasureUse();

    whenIClickBack();

    // thenTheUrlShouldContain(PageURLs.emergencyContact);
    // iCanSeeMyEmergencyContactDetails();
    // whenIClickBack();
    //
    // thenTheUrlShouldContain(PageURLs.aircraftCommunications);
    // thenTheCheckboxShouldBeChecked("#satelliteTelephone");
    // thenTheInputShouldContain("+881612345678", "#satelliteTelephoneInput");
    // whenIClickBack();
    //
    // thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
    // iCanSeeAHeadingThatContains("aircraft");
    // thenTheInputShouldContain("15", "#maxCapacity");
    // whenIClickBack();
    //
    // thenTheUrlShouldContain(PageURLs.activity);
    // iCanSeeAHeadingThatContains("aviation");
    // iCanSeeAHeadingThatContains("pleasure");
    // thenTheRadioButtonShouldBeSelected("#jet-aircraft");
    // whenIClickBack();
    //
    // thenTheUrlShouldContain(PageURLs.purpose);
    // iCanSeeAHeadingThatContains("aviation");
    // thenTheCheckboxShouldBeChecked("#pleasure");
    // whenIClickBack();
    //
    // thenTheUrlShouldContain(PageURLs.environment);
    // thenTheRadioButtonShouldBeSelected("#aviation");
  });

  it("I can register my beacon for commercial purposes", () => {
    givenIHaveEnteredMyBeaconDetails();

    thenTheUrlShouldContain(PageURLs.environment);
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
    givenIHaveSelected("#satelliteTelephone");
    givenIHaveTyped("+881612345678", "#satelliteTelephoneInput");
    andIClickContinue();

    thenTheUrlShouldContain(PageURLs.moreDetails);
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.aircraftCommunications);
    thenTheCheckboxShouldBeChecked("#satelliteTelephone");
    thenTheInputShouldContain("+881612345678", "#satelliteTelephoneInput");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
    iCanSeeAHeadingThatContains("aircraft");
    thenTheInputShouldContain("15", "#maxCapacity");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.activity);
    iCanSeeAHeadingThatContains("aviation");
    iCanSeeAHeadingThatContains("commercial");
    thenTheRadioButtonShouldBeSelected("#passenger-plane");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.purpose);
    iCanSeeAHeadingThatContains("aviation");
    thenTheCheckboxShouldBeChecked("#commercial");
    whenIClickBack();

    thenTheUrlShouldContain(PageURLs.environment);
    thenTheRadioButtonShouldBeSelected("#aviation");
  });
});
