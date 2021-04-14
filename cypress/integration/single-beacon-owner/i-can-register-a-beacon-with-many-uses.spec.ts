import { Environment, Purpose } from "../../../src/lib/registration/types";
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
import {
  givenIHaveEnteredMyAviationUse,
  iCanGoBackAndEditMyAviationUse,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  andIHaveNoFurtherUses,
} from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanGoBackAndEditMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import { thenTheUrlShouldContain } from "../common/selectors-and-assertions.spec";

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
    iCanUseTheBackButtonToEditTheLastUseIEntered(
      Environment.AVIATION,
      Purpose.PLEASURE
    );
  });
});

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
