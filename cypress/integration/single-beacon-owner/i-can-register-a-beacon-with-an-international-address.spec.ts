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
  givenIHaveEnteredMyRestOfWorldAddressDetails,
  givenIHaveSelectedARestOfWorldAddress,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
  iCanSeeMyRestOfWorldAddressDetails,
} from "../../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanGoBackAndEditMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../../common/i-can-enter-use-information/maritime.spec";
import {
  givenIHaveSignedIn,
  thenTheUrlShouldContain,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner with an address outside of the United Kingdom", () => {
  it("I can register my beacon", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyMaritimeUse(Purpose.COMMERCIAL);
    iCanSeeMyMaritimeUse(Purpose.COMMERCIAL);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveSelectedARestOfWorldAddress();
    givenIHaveEnteredMyRestOfWorldAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.COMMERCIAL);
    iCanSeeMyPersonalDetails();
    iCanSeeMyRestOfWorldAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyMaritimeUse(Purpose.COMMERCIAL);
  });
});
