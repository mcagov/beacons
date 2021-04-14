import {
  AdditionalUses,
  Environment,
  Purpose,
} from "../../../src/lib/registration/types";
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
  iCanGoBackAndEditMyAviationUse,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  andIHaveNoFurtherUses,
  iCanEditMyEnvironment,
} from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanEditMyAdditionalMaritimeUseInformation,
  iCanEditMyMaritimeActivity,
  iCanEditMyMaritimeEnvironment,
  iCanEditMyMaritimePurpose,
  iCanEditMyVesselCommunications,
  iCanEditMyVesselDetails,
  iCanGoBackAndEditMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  givenIAmAt,
  iAmAt,
  thenTheRadioButtonShouldBeSelected,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common/selectors-and-assertions.spec";

describe("As a single beacon owner with many uses,", () => {
  it("I can register my beacon for a maritime and an aviation use", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    andIHaveAnotherUse();
    givenIHaveEnteredMyAviationUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyAviationUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();

    iCanGoBackThroughTheFormInReverse();
    iCanClickEveryChangeButtonToEditMyRegistration();
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
  iCanEditMyAdditionalUsesChoice(AdditionalUses.NO);
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
  iCanEditMyAdditionalUsesChoice(AdditionalUses.YES);
  whenIClickBack();
  iCanEditMyEnvironment(Environment.AVIATION);
  whenIClickBack();
  iCanEditMyAdditionalUsesChoice(AdditionalUses.YES);
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
  whenIClickBack();
  iCanEditMyAdditionalBeaconInformation();
  whenIClickBack();
  iCanEditMyBeaconDetails();
  whenIClickBack();
  iAmAt(PageURLs.start);
};

const iCanEditMyAdditionalUsesChoice = (additionalChoices: AdditionalUses) => {
  switch (additionalChoices) {
    case AdditionalUses.YES:
      thenTheRadioButtonShouldBeSelected("#yes");
      break;
    case AdditionalUses.NO:
      thenTheRadioButtonShouldBeSelected("#no");
  }
};

const iCanUseTheBackButtonToEditTheLastUseIEntered = (
  environment: Environment,
  purpose: Purpose
) => {
  switch (environment) {
    case Environment.AVIATION:
      iCanGoBackAndEditMyAviationUse(purpose);
      break;
    case Environment.MARITIME:
      iCanGoBackAndEditMyMaritimeUse(purpose);
      break;
  }
};

const iCanClickEveryChangeButtonToEditMyRegistration = () => {
  givenIAmAt(PageURLs.checkYourAnswers);

  const changeLinkAssertions = {
    [PageURLs.checkBeaconDetails]: iCanEditMyBeaconDetails,
    [PageURLs.beaconInformation]: iCanEditMyAdditionalBeaconInformation,
    [PageURLs.environment + "?useIndex=0"]: iCanEditMyMaritimeEnvironment,
    [PageURLs.aboutTheVessel + "?useIndex=0"]: iCanEditMyVesselDetails,
    [PageURLs.vesselCommunications +
    "?useIndex=0"]: iCanEditMyVesselCommunications,
    [PageURLs.moreDetails +
    "?useIndex=0"]: iCanEditMyAdditionalMaritimeUseInformation,
    [PageURLs.environment + "?useIndex=1"]: iCanEditMyAviationEnvironment,
    [PageURLs.aboutTheAircraft + "?useIndex=1"]: iCanEditMyAircraftDetails,
    [PageURLs.aircraftCommunications +
    "?useIndex=1"]: iCanEditMyAircraftCommunications,
    [PageURLs.moreDetails +
    "?useIndex=1"]: iCanEditMyAdditionalAviationUseInformation,
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
