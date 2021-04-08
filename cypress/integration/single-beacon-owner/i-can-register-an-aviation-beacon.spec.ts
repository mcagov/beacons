import { PageURLs } from "../../../src/lib/urls";
import { testAviationPleasureUse } from "../happy-path-test-data.spec";
import {
  iCanEditMyActivity,
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyAdditionalUseInformation,
  iCanEditMyAddressDetails,
  iCanEditMyAircraftCommunications,
  iCanEditMyAircraftDetails,
  iCanEditMyBeaconDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyEnvironment,
  iCanEditMyPersonalDetails,
  iCanEditMyPurpose,
} from "../i-can-edit-previously-entered-information.spec";
import {
  iCanSeeMyAddressDetails,
  iCanSeeMyAviationPleasureUse,
  iCanSeeMyBeaconDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
} from "../i-can-see-previously-entered-information.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  iAmAt,
  iCanSeeAHeadingThatContains,
  thenTheCheckboxShouldBeChecked,
  thenTheInputShouldContain,
  thenTheRadioButtonShouldBeSelected,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../selectors-and-assertions.spec";
import {
  andIHaveNoFurtherUses,
  givenIHaveEnteredInformationAboutMyAircraft,
  givenIHaveEnteredMoreDetailsAboutMyAircraft,
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyAircraftCommunicationDetails,
  givenIHaveEnteredMyBeaconDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
} from "../user-enters-information.spec";

describe("As an aviation beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationPleasureUse();
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAviationPleasureUse();
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();

    whenIClickBack();
    iCanEditMyEmergencyContactDetails();
    whenIClickBack();
    iCanEditMyAddressDetails();
    whenIClickBack();
    iCanEditMyPersonalDetails();
    whenIClickBack();
    iCanEditMyAdditionalUseInformation();
    whenIClickBack();
    iCanEditMyAircraftCommunications();
    whenIClickBack();
    iCanEditMyAircraftDetails();
    whenIClickBack();
    iCanEditMyActivity();
    whenIClickBack();
    iCanEditMyPurpose();
    whenIClickBack();
    iCanEditMyEnvironment();
    whenIClickBack();
    iCanEditMyAdditionalBeaconInformation();
    whenIClickBack();
    iCanEditMyBeaconDetails();
    whenIClickBack();
    iAmAt(PageURLs.start);
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

export const givenIHaveEnteredMyAviationPleasureUse = (): void => {
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
  givenIHaveSelected("#" + testAviationPleasureUse.type.activity.toLowerCase());
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
  iCanSeeAHeadingThatContains("aircraft");
  givenIHaveEnteredInformationAboutMyAircraft();
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.aircraftCommunications);
  givenIHaveEnteredMyAircraftCommunicationDetails();
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.moreDetails);
  givenIHaveEnteredMoreDetailsAboutMyAircraft();
  andIClickContinue();
};
