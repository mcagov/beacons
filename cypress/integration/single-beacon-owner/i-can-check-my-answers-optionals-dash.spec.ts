import { Purpose } from "../../../src/lib/deprecatedRegistration/types";
import { PageURLs } from "../../../src/lib/urls";
import {
  givenIHaveEnteredMyRequiredBeaconDetails,
  iCanSeeMyBeaconDetails,
  iCanSeeMyRequiredAdditionalBeaconInformationOrDash,
} from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyRequiredEmergencyContactDetails,
  givenIHaveEnteredMyRequiredPersonalDetails,
  iCanSeeMyRequiredAddressDetails,
  iCanSeeMyRequiredEmergencyContactDetails,
  iCanSeeMyRequiredPersonalDetails,
} from "../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyRequiredMaritimeUse,
  iCanSeeMyRequiredMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import { thenTheUrlShouldContain } from "../common/selectors-and-assertions.spec";

describe("As a beacon owner who enters all required fields,", () => {
  it("I check my answers and the optional data is marked as dash", () => {
    givenIHaveEnteredMyRequiredBeaconDetails();
    givenIHaveEnteredMyRequiredMaritimeUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyRequiredPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyRequiredEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyRequiredAdditionalBeaconInformationOrDash();

    iCanSeeMyRequiredMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyRequiredPersonalDetails();
    iCanSeeMyRequiredAddressDetails();
    iCanSeeMyRequiredEmergencyContactDetails();
  });
});
