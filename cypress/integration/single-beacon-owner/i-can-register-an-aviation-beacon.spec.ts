import { Purpose } from "../../../src/lib/deprecatedRegistration/types";
import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyBeaconDetails,
  iCanSeeMyAdditionalBeaconInformation,
  iCanSeeMyBeaconDetails,
} from "../../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  givenIHaveEnteredMyUnitedKingdomAddressDetails,
  givenIHaveSelectedAUnitedKingdomAddress,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
  iCanSeeMyUnitedKingdomAddressDetails,
} from "../../common/i-can-enter-owner-information.spec";
import {
  givenIHaveEnteredMyAviationUse,
  iCanGoBackAndEditMyAviationUse,
  iCanSeeMyAviationUse,
  iCanSeeMySingleAviationUse,
} from "../../common/i-can-enter-use-information/aviation.spec";
import { andIHaveNoFurtherUses } from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveSignedIn,
  thenTheUrlShouldContain,
} from "../../common/selectors-and-assertions.spec";

describe("As an aviation beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationUse(Purpose.PLEASURE);
    iCanSeeMyAviationUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleAviationUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyUnitedKingdomAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyAviationUse(Purpose.PLEASURE);
  });

  it("I can register my beacon for commercial purposes", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
    iCanSeeMyAviationUse(Purpose.COMMERCIAL);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleAviationUse(Purpose.COMMERCIAL);
    iCanSeeMyPersonalDetails();
    iCanSeeMyUnitedKingdomAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyAviationUse(Purpose.COMMERCIAL);
  });
});
