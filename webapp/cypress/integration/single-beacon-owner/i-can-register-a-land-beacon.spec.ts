import { Environment } from "../../../src/lib/deprecatedRegistration/types";
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
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  givenIHaveEnteredMyUnitedKingdomAddressDetails,
  givenIHaveSelectedAUnitedKingdomAddress,
  iCanEditMyAddressDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyPersonalDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
  iCanSeeMyUnitedKingdomAddressDetails,
} from "../../common/i-can-enter-owner-information.spec";
import {
  andIHaveNoFurtherUses,
  iCanEditMyEnvironment,
  iCanEditMyNUses,
} from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanChangeMyLandCommunications,
  iCanEditMyAdditionalLandUseMoreDetails,
  iCanEditMyLandActivity,
  iCanEditMyLandCommunications,
  iCanSeeMyLandUse,
  iCanSeeMySingleLandUse,
  iCanViewMyChangedLandCommunications,
} from "../../common/i-can-enter-use-information/land.spec";
import {
  andIClickContinue,
  givenIHaveSignedIn,
  iHaveVisited,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickBackTimes,
} from "../../common/selectors-and-assertions.spec";

describe("As a land beacon owner", () => {
  it("I can register my beacon", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    iCanSeeMyLandUse();
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleLandUse();
    iCanSeeMyPersonalDetails();
    iCanSeeMyUnitedKingdomAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyLandUse();
  });

  const iCanGoBackAndEditMyLandUse = (): void => {
    whenIClickBack();
    iCanEditMyEmergencyContactDetails();
    whenIClickBack();
    iCanEditMyAddressDetails();
    // Go back twice due to branch
    whenIClickBackTimes(2);
    iCanEditMyPersonalDetails();
    whenIClickBack();
    iCanEditMyNUses(1);
    whenIClickBack();
    iCanEditMyAdditionalLandUseMoreDetails();
    whenIClickBack();
    iCanEditMyLandCommunications();
    iCanChangeMyLandCommunications();
    andIClickContinue();
    whenIClickBack();
    iCanViewMyChangedLandCommunications();
    whenIClickBack();
    iCanEditMyLandActivity();
    whenIClickBack();
    iCanEditMyEnvironment(Environment.LAND);
    whenIClickBack();
    iCanEditMyAdditionalBeaconInformation();
    whenIClickBack();
    iCanEditMyBeaconDetails();
    whenIClickBack();
    iHaveVisited(GeneralPageURLs.start);
  };
});
