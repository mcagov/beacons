import {
  testMaritimeCommercialUseData,
  testMaritimePleasureUseData,
  testMaritimeUseData,
} from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveClearedAndTypedInAField,
  givenIHaveSelected,
  givenIHaveTypedInAnEmptyField,
  iCanSeeAPageHeadingThatContains,
} from "../selectors-and-assertions.spec";
import { makeEnumValueUserFriendly } from "../writing-style.spec";

export const givenIHaveEnteredMyMaritimeUse = (purpose): void => {
  givenIHaveSelected("#maritime");
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("maritime");
  givenIHaveSelected(`#${purpose.toLowerCase()}`);
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("maritime");
  iCanSeeAPageHeadingThatContains(purpose.toLowerCase());
  switch (purpose) {
    case "COMMERCIAL":
      givenIHaveSelected("#motor-vessel");
      break;
    case "PLEASURE":
      givenIHaveSelected("#motor-vessel");
      break;
  }
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("vessel");
  givenIHaveEnteredInformationAboutMyVessel();
  andIClickContinue();

  givenIHaveEnteredMyVesselCommunicationDetails();
  andIClickContinue();

  givenIHaveEnteredMoreDetailsAboutMyVessel();
  andIClickContinue();
};

export const iCanSeeMyMaritimeUse = (purpose): void => {
  switch (purpose) {
    case "COMMERCIAL":
      Object.values(testMaritimeCommercialUseData.type).forEach((value) => {
        cy.get("main").contains(makeEnumValueUserFriendly(value));
      });
      break;
    case "PLEASURE":
      Object.values(testMaritimePleasureUseData.type).forEach((value) => {
        cy.get("main").contains(makeEnumValueUserFriendly(value));
      });
      break;
  }
  Object.values(testMaritimeUseData.vessel).forEach((value) => {
    cy.get("main").contains(value);
  });
  cy.get("main").contains(testMaritimeUseData.communications.fixedMMSI);
  cy.get("main").contains(testMaritimeUseData.communications.portableMMSI);
  cy.get("main").contains(
    testMaritimeUseData.communications.satelliteTelephone,
  );
  cy.get("main").contains(testMaritimeUseData.communications.mobileTelephone1);
  cy.get("main").contains(testMaritimeUseData.communications.mobileTelephone2);
  cy.get("main").contains(
    testMaritimeUseData.communications.otherCommunication,
  );
  cy.get("main").contains(testMaritimeUseData.moreDetails);
};

export const givenIHaveEnteredInformationAboutMyVessel = (): void => {
  const vessel = testMaritimeUseData.vessel;
  givenIHaveClearedAndTypedInAField(vessel.maxCapacity, "#maxCapacity");
  givenIHaveTypedInAnEmptyField(vessel.name, "#vesselName");
  givenIHaveTypedInAnEmptyField(vessel.beaconPosition, "#beaconLocation");
  givenIHaveTypedInAnEmptyField(vessel.pln, "#portLetterNumber");
  givenIHaveTypedInAnEmptyField(vessel.homePort, "#homeport");
  givenIHaveTypedInAnEmptyField(vessel.typicalAO, "#areaOfOperation");
  givenIHaveTypedInAnEmptyField(vessel.imoNumber, "#imoNumber");
  givenIHaveTypedInAnEmptyField(vessel.ssrNumber, "#ssrNumber");
  givenIHaveTypedInAnEmptyField(vessel.rssNumber, "#rssNumber");
  givenIHaveTypedInAnEmptyField(vessel.officialNumber, "#officialNumber");
  givenIHaveTypedInAnEmptyField(
    vessel.rigPlatformLocation,
    "#rigPlatformLocation",
  );
};

export const givenIHaveEnteredMyVesselCommunicationDetails = (): void => {
  const comms = testMaritimeUseData.communications;
  givenIHaveTypedInAnEmptyField(comms.callSign, "#callSign");
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#fixedVhfRadio");
  givenIHaveTypedInAnEmptyField(comms.fixedMMSI, "#fixedVhfRadioInput");
  givenIHaveSelected("#portableVhfRadio");
  givenIHaveTypedInAnEmptyField(comms.portableMMSI, "#portableVhfRadioInput");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTypedInAnEmptyField(
    comms.satelliteTelephone,
    "#satelliteTelephoneInput",
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTypedInAnEmptyField(
    comms.mobileTelephone1,
    "#mobileTelephoneInput1",
  );
  givenIHaveTypedInAnEmptyField(
    comms.mobileTelephone2,
    "#mobileTelephoneInput2",
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTypedInAnEmptyField(
    comms.otherCommunication,
    "#otherCommunicationInput",
  );
};

export const givenIHaveEnteredMoreDetailsAboutMyVessel = (): void => {
  givenIHaveTypedInAnEmptyField(
    testMaritimeUseData.moreDetails,
    "#moreDetails",
  );
};
