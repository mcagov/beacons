import { Environment } from "../../../src/lib/registration/types";
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
  andIHaveNoFurtherUses,
  iCanEditMyEnvironment,
  iCanEditMyNUses,
} from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanChangeMyLandCommunications,
  iCanEditMyAdditionalLandUseMoreDetails,
  iCanEditMyLandActivity,
  iCanEditMyLandCommunications,
  iCanSeeMyLandUse,
  iCanSeeMySingleLandUse,
  iCanViewMyChangedLandCommunications,
} from "../common/i-can-enter-use-information/land.spec";
import {
  andIClickContinue,
  iAmAt,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../common/selectors-and-assertions.spec";

describe("As a land beacon owner", () => {
  it("I can register my beacon", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    iCanSeeMyLandUse();
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleLandUse();
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyLandUse();
  });

  const iCanGoBackAndEditMyLandUse = (): void => {
    whenIClickBack();
    iCanEditMyEmergencyContactDetails();
    whenIClickBack();
    iCanEditMyAddressDetails();
    whenIClickBack();
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
    iAmAt(PageURLs.start);
  };
});
