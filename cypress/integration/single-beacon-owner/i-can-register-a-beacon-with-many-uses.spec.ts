import { Environment, Purpose } from "../../../src/lib/registration/types";
import { PageURLs } from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyBeaconDetails,
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyBeaconDetails,
  iCanSeeMyAdditionalBeaconInformation,
  iCanSeeMyBeaconDetails,
} from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  iCanEditMyAddressDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyPersonalDetails,
  iCanSeeMyAddressDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
} from "../common/i-can-enter-owner-information.spec";
import {
  givenIHaveEnteredMyAviationUse,
  iCanEditMyAdditionalAviationUseInformation,
  iCanEditMyAircraftCommunications,
  iCanEditMyAircraftDetails,
  iCanEditMyAviationActivity,
  iCanEditMyAviationEnvironment,
  iCanEditMyAviationPurpose,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  andIHaveNoFurtherUses,
  iCanEditMyEnvironment,
  iCanEditMyNUses,
} from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanEditMyAdditionalLandUseMoreDetails,
  iCanEditMyLandActivity,
  iCanEditMyLandCommunications,
  iCanEditMyLandEnvironment,
  iCanSeeMyLandUse,
} from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanEditMyAdditionalMaritimeUseInformation,
  iCanEditMyMaritimeActivity,
  iCanEditMyMaritimeEnvironment,
  iCanEditMyMaritimePurpose,
  iCanEditMyVesselCommunications,
  iCanEditMyVesselDetails,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  givenIAmAt,
  iAmAt,
  iCanSeeAPageHeadingThatContains,
  iCanSeeASectionHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common/selectors-and-assertions.spec";

describe("As a single beacon owner with many uses", () => {
  it.only("I can register my beacon for a land, maritime pleasure, and aviation pleasure use", () => {
    givenIHaveEnteredMyBeaconDetails();
    iCanSeeAPageHeadingThatContains("main use");
    givenIHaveEnteredMyLandUse();
    iCanEditMyNUses(1);
    andIHaveAnotherUse();
    iCanSeeAPageHeadingThatContains("second use");
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    iCanEditMyNUses(2);
    andIHaveAnotherUse();
    iCanSeeAPageHeadingThatContains("third use");
    givenIHaveEnteredMyAviationUse(Purpose.PLEASURE);
    iCanEditMyNUses(3);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeASectionHeadingThatContains("Main use");
    iCanSeeMyLandUse();
    iCanSeeASectionHeadingThatContains("Second use");
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyAviationUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackThroughTheFormInReverse();
  });
});

const iCanGoBackThroughTheFormInReverse = () => {
  whenIClickBack();
  iCanEditMyEmergencyContactDetails();
  whenIClickBack();
  iCanEditMyAddressDetails();
  whenIClickBack();
  iCanEditMyPersonalDetails();
  whenIClickBack();
  iCanEditMyNUses(3);
  whenIClickBack();
  iCanEditMyAdditionalAviationUseInformation();
  whenIClickBack();
  iCanEditMyAircraftCommunications();
  whenIClickBack();
  iCanEditMyAircraftDetails();
  whenIClickBack();
  iCanEditMyAviationActivity();
  whenIClickBack();
  iCanEditMyAviationPurpose(Purpose.PLEASURE);
  whenIClickBack();
  iCanEditMyEnvironment(Environment.AVIATION);
  iCanSeeAPageHeadingThatContains("third use");
  whenIClickBack();
  iCanEditMyNUses(3);
  whenIClickBack();
  iCanEditMyAdditionalMaritimeUseInformation();
  whenIClickBack();
  iCanEditMyVesselCommunications();
  whenIClickBack();
  iCanEditMyVesselDetails();
  whenIClickBack();
  iCanEditMyMaritimeActivity();
  whenIClickBack();
  iCanEditMyMaritimePurpose(Purpose.PLEASURE);
  whenIClickBack();
  iCanEditMyEnvironment(Environment.MARITIME);
  iCanSeeAPageHeadingThatContains("second use");
  whenIClickBack();
  iCanEditMyNUses(3);
  whenIClickBack();
  iCanEditMyAdditionalLandUseMoreDetails();
  whenIClickBack();
  iCanEditMyLandCommunications();
  whenIClickBack();
  iCanEditMyLandActivity();
  whenIClickBack();
  iCanEditMyLandEnvironment();
  whenIClickBack();
  iCanEditMyAdditionalBeaconInformation();
  whenIClickBack();
  iCanEditMyBeaconDetails();
  whenIClickBack();
  iAmAt(PageURLs.start);
  iCanClickEveryChangeButtonToEditMyRegistration();
};

const iCanClickEveryChangeButtonToEditMyRegistration = () => {
  givenIAmAt(PageURLs.checkYourAnswers);

  const changeLinkAssertions = {
    [PageURLs.checkBeaconDetails]: iCanEditMyBeaconDetails,
    [PageURLs.beaconInformation]: iCanEditMyAdditionalBeaconInformation,
    [PageURLs.environment + "?useIndex=0"]: iCanEditMyLandEnvironment,
    [PageURLs.landCommunications + "?useIndex=0"]: iCanEditMyLandCommunications,
    [PageURLs.moreDetails + "?useIndex=0"]:
      iCanEditMyAdditionalLandUseMoreDetails,
    [PageURLs.environment + "?useIndex=1"]: iCanEditMyMaritimeEnvironment,
    [PageURLs.aboutTheVessel + "?useIndex=1"]: iCanEditMyVesselDetails,
    [PageURLs.vesselCommunications + "?useIndex=1"]:
      iCanEditMyVesselCommunications,
    [PageURLs.moreDetails + "?useIndex=1"]:
      iCanEditMyAdditionalMaritimeUseInformation,
    [PageURLs.environment + "?useIndex=2"]: iCanEditMyAviationEnvironment,
    [PageURLs.aboutTheAircraft + "?useIndex=2"]: iCanEditMyAircraftDetails,
    [PageURLs.aircraftCommunications + "?useIndex=2"]:
      iCanEditMyAircraftCommunications,
    [PageURLs.moreDetails + "?useIndex=2"]:
      iCanEditMyAdditionalAviationUseInformation,
    [PageURLs.aboutBeaconOwner]: iCanEditMyPersonalDetails,
    [PageURLs.beaconOwnerAddress]: iCanEditMyAddressDetails,
    [PageURLs.emergencyContact]: iCanEditMyEmergencyContactDetails,
  };

  Object.entries(changeLinkAssertions).forEach(([href, assertion]) => {
    cy.get(`.govuk-link[href="${href}"]`).first().click();
    assertion();

    // TODO: Assert that clicking "Continue" after having clicked a "Change"
    // link from check-your-answers returns the user immediately back to
    // check-your-answers.  E.g.:
    // ---
    // andIClickContinue();
    // thenTheUrlShouldContain(PageURLs.checkYourAnswers)
    // ---
    // See https://design-system.service.gov.uk/patterns/check-answers/
    cy.visit(PageURLs.checkYourAnswers);
  });
};
