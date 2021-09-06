import { Purpose } from "../../../src/lib/deprecatedRegistration/types";
import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyBeaconDetails,
  iCanSeeMyAdditionalBeaconInformation,
  iCanSeeMyBeaconDetails,
} from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  iCanSeeMyAddressDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
} from "../common/i-can-enter-owner-information.spec";
import {
  givenIHaveEnteredMyAviationUse,
  iCanGoBackAndEditMyAviationUse,
  iCanSeeMyAviationUse,
  iCanSeeMySingleAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveSignedIn,
  thenTheUrlShouldContain,
} from "../common/selectors-and-assertions.spec";

describe("As an aviation beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationUse(Purpose.PLEASURE);
    iCanSeeMyAviationUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleAviationUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
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
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMySingleAviationUse(Purpose.COMMERCIAL);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyAviationUse(Purpose.COMMERCIAL);
  });
});
