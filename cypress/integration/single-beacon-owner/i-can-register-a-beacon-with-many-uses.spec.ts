import { Purpose } from "../../../src/lib/registration/types";
import { PageURLs } from "../../../src/lib/urls";
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
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanGoBackAndEditMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import { thenTheUrlShouldContain } from "../common/selectors-and-assertions.spec";

describe("As a single beacon owner with many uses,", () => {
  it("I can register my beacon for two maritime uses", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyMaritimeUse(Purpose.PLEASURE);
  });
});
