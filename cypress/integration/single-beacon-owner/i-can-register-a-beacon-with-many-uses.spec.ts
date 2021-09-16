import {
  Environment,
  Purpose,
} from "../../../src/lib/deprecatedRegistration/types";
import {
  CreateRegistrationPageURLs,
  GeneralPageURLs,
} from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyBeaconDetails,
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyBeaconDetails,
  iCanSeeMyAdditionalBeaconInformation,
  iCanSeeMyBeaconDetails,
} from "../../common/i-can-enter-beacon-information.spec";
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
} from "../../common/i-can-enter-owner-information.spec";
import {
  givenIHaveEnteredMyAviationUse,
  iCanEditMyAdditionalAviationUseInformation,
  iCanEditMyAircraftCommunications,
  iCanEditMyAircraftDetails,
  iCanEditMyAviationActivity,
  iCanEditMyAviationEnvironment,
  iCanEditMyAviationPurpose,
  iCanSeeMyAviationUse,
} from "../../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  andIHaveNoFurtherUses,
  iCanEditMyEnvironment,
  iCanEditMyNUses,
} from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanEditMyAdditionalLandUseMoreDetails,
  iCanEditMyLandActivity,
  iCanEditMyLandCommunications,
  iCanEditMyLandEnvironment,
  iCanSeeMyLandUse,
} from "../../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanEditMyAdditionalMaritimeUseInformation,
  iCanEditMyMaritimeActivity,
  iCanEditMyMaritimeEnvironment,
  iCanEditMyMaritimePurpose,
  iCanEditMyVesselCommunications,
  iCanEditMyVesselDetails,
  iCanSeeMyMaritimeUse,
} from "../../common/i-can-enter-use-information/maritime.spec";
import {
  givenIHaveSignedIn,
  givenIHaveVisited,
  iCanSeeAPageHeadingThatContains,
  iCanSeeASectionHeadingThatContains,
  iHaveVisited,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../../common/selectors-and-assertions.spec";

describe("As a single beacon owner with many uses", () => {
  it("I can register my beacon for a land, maritime pleasure, and aviation pleasure use", () => {
    givenIHaveSignedIn();
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

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
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
  iHaveVisited(GeneralPageURLs.start);
  iCanClickEveryChangeButtonToEditMyRegistration();
};

const iCanClickEveryChangeButtonToEditMyRegistration = () => {
  givenIHaveVisited(CreateRegistrationPageURLs.checkYourAnswers);

  const changeLinkAssertions = {
    [CreateRegistrationPageURLs.checkBeaconDetails]: iCanEditMyBeaconDetails,
    [CreateRegistrationPageURLs.beaconInformation]:
      iCanEditMyAdditionalBeaconInformation,
    [CreateRegistrationPageURLs.environment + "?useId=0"]:
      iCanEditMyLandEnvironment,
    [CreateRegistrationPageURLs.landCommunications + "?useId=0"]:
      iCanEditMyLandCommunications,
    [CreateRegistrationPageURLs.moreDetails + "?useId=0"]:
      iCanEditMyAdditionalLandUseMoreDetails,
    [CreateRegistrationPageURLs.environment + "?useId=1"]:
      iCanEditMyMaritimeEnvironment,
    [CreateRegistrationPageURLs.aboutTheVessel + "?useId=1"]:
      iCanEditMyVesselDetails,
    [CreateRegistrationPageURLs.vesselCommunications + "?useId=1"]:
      iCanEditMyVesselCommunications,
    [CreateRegistrationPageURLs.moreDetails + "?useId=1"]:
      iCanEditMyAdditionalMaritimeUseInformation,
    [CreateRegistrationPageURLs.environment + "?useId=2"]:
      iCanEditMyAviationEnvironment,
    [CreateRegistrationPageURLs.aboutTheAircraft + "?useId=2"]:
      iCanEditMyAircraftDetails,
    [CreateRegistrationPageURLs.aircraftCommunications + "?useId=2"]:
      iCanEditMyAircraftCommunications,
    [CreateRegistrationPageURLs.moreDetails + "?useId=2"]:
      iCanEditMyAdditionalAviationUseInformation,
    [CreateRegistrationPageURLs.aboutBeaconOwner]: iCanEditMyPersonalDetails,
    [CreateRegistrationPageURLs.beaconOwnerAddress]: iCanEditMyAddressDetails,
    [CreateRegistrationPageURLs.emergencyContact]:
      iCanEditMyEmergencyContactDetails,
  };

  Object.entries(changeLinkAssertions).forEach(([href, assertion]) => {
    cy.get(`.govuk-link[href="${href}"]`).first().click();
    assertion();

    // TODO: Assert that clicking "Continue" after having clicked a "Change"
    // link from check-your-answers returns the user immediately back to
    // check-your-answers.  E.g.:
    // ---
    // andIClickContinue();
    // thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers)
    // ---
    // See https://design-system.service.gov.uk/patterns/check-answers/
    cy.visit(CreateRegistrationPageURLs.checkYourAnswers);
  });
};
