import { Purpose } from "../../../src/lib/deprecatedRegistration/types";
import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyRequiredBeaconDetails,
  iCanSeeMyBeaconDetails,
  iCanSeeMyRequiredAdditionalBeaconInformationOrDash,
} from "../../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyRequiredEmergencyContactDetails,
  givenIHaveEnteredMyRequiredPersonalDetails,
  givenIHaveEnteredMyUnitedKingdomAddressDetails,
  givenIHaveSelectedAUnitedKingdomAddress,
  iCanSeeMyRequiredAddressDetails,
  iCanSeeMyRequiredEmergencyContactDetails,
  iCanSeeMyRequiredPersonalDetails,
} from "../../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyRequiredMaritimeUse,
  iCanSeeMyRequiredMaritimeUse,
} from "../../common/i-can-enter-use-information/maritime.spec";
import {
  givenIHaveSignedIn,
  thenTheUrlShouldContain,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner who enters all required fields,", () => {
  it("I check my answers and the optional data is marked as dash", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyRequiredBeaconDetails();
    givenIHaveEnteredMyRequiredMaritimeUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyRequiredPersonalDetails();
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyRequiredEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyRequiredAdditionalBeaconInformationOrDash();

    iCanSeeMyRequiredMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyRequiredPersonalDetails();
    iCanSeeMyRequiredAddressDetails();
    iCanSeeMyRequiredEmergencyContactDetails();
  });
});
