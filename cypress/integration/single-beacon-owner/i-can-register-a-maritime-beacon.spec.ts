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

describe("As a maritime beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
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

  it("I can register my beacon for commercial purposes", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyMaritimeUse(Purpose.COMMERCIAL);
    iCanSeeMyMaritimeUse(Purpose.COMMERCIAL);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.COMMERCIAL);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyMaritimeUse(Purpose.COMMERCIAL);
  });
});
