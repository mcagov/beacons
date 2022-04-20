import {
  testAviationCommercialUseData,
  testAviationPleasureUseData,
  testAviationUseData,
} from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAPageHeadingThatContains,
} from "../selectors-and-assertions.spec";
import { makeEnumValueUserFriendly } from "../writing-style.spec";

export const givenIHaveEnteredMyAviationUse = (purpose: string): void => {
  givenIHaveSelected("#aviation");
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("aviation");
  givenIHaveSelected(`#${purpose.toLowerCase()}`);
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("aviation");
  iCanSeeAPageHeadingThatContains(purpose.toLowerCase());
  switch (purpose) {
    case "COMMERCIAL":
      givenIHaveSelected(
        "#" + testAviationCommercialUseData.type.activity.toLowerCase()
      );
      break;
    case "PLEASURE":
      givenIHaveSelected(
        "#" + testAviationPleasureUseData.type.activity.toLowerCase()
      );
      break;
  }
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("aircraft");
  givenIHaveEnteredInformationAboutMyAircraft();
  andIClickContinue();

  givenIHaveEnteredMyAircraftCommunicationDetails();
  andIClickContinue();

  givenIHaveEnteredMoreDetailsAboutMyAircraft();
  andIClickContinue();
};

export const andIHaveEnteredMyAviationUse = givenIHaveEnteredMyAviationUse;

export const iCanSeeMyAviationUse = (purpose: string): void => {
  switch (purpose) {
    case "COMMERCIAL":
      Object.values(testAviationCommercialUseData.type).forEach((value) => {
        cy.get("main").contains(makeEnumValueUserFriendly(value));
      });
      break;
    case "PLEASURE":
      Object.values(testAviationPleasureUseData.type).forEach((value) => {
        cy.get("main").contains(makeEnumValueUserFriendly(value));
      });
      break;
  }
  Object.values(testAviationUseData.aircraft).forEach((value) => {
    cy.get("main").contains(value);
  });
  cy.get("main").contains(
    testAviationUseData.communications.satelliteTelephone
  );
  cy.get("main").contains(testAviationUseData.communications.mobileTelephone1);
  cy.get("main").contains(testAviationUseData.communications.mobileTelephone2);
  cy.get("main").contains(
    testAviationUseData.communications.otherCommunication
  );
  cy.get("main").contains(testAviationUseData.moreDetails);
  cy.get("main").contains("dongle");
};

export const givenIHaveEnteredInformationAboutMyAircraft = (): void => {
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.maxCapacity,
    "#maxCapacity"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.manufacturer,
    "#aircraftManufacturer"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.principalAirport,
    "#principalAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.secondaryAirport,
    "#secondaryAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.registrationMark,
    "#registrationMark"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.hexAddress,
    "#hexAddress"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.cnOrMsnNumber,
    "#cnOrMsnNumber"
  );
  givenIHaveSelected("#dongle-yes");
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.beaconPosition,
    "#beaconPosition"
  );
};

export const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(
    testAviationUseData.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(
    testAviationUseData.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTyped(
    testAviationUseData.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(
    testAviationUseData.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};

const givenIHaveEnteredMoreDetailsAboutMyAircraft = (): void => {
  givenIHaveTyped(testAviationUseData.moreDetails, "#moreDetails");
};
