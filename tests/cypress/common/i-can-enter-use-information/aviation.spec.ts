import {
  testAviationCommercialUseData,
  testAviationPleasureUseData,
  testAviationUseData,
} from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTypedInAnEmptyField,
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
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.maxCapacity,
    "#maxCapacity"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.manufacturer,
    "#aircraftManufacturer"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.principalAirport,
    "#principalAirport"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.secondaryAirport,
    "#secondaryAirport"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.registrationMark,
    "#registrationMark"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.hexAddress,
    "#hexAddress"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.cnOrMsnNumber,
    "#cnOrMsnNumber"
  );
  givenIHaveSelected("#dongle-yes");
  givenIHaveTypedInAnEmptyField(
    testAviationPleasureUseData.aircraft.beaconPosition,
    "#beaconPosition"
  );
};

export const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTypedInAnEmptyField(
    testAviationUseData.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTypedInAnEmptyField(
    testAviationUseData.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTypedInAnEmptyField(
    testAviationUseData.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTypedInAnEmptyField(
    testAviationUseData.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};

const givenIHaveEnteredMoreDetailsAboutMyAircraft = (): void => {
  givenIHaveTypedInAnEmptyField(
    testAviationUseData.moreDetails,
    "#moreDetails"
  );
};
