import {
  testMaritimeCommercialUseData,
  testMaritimePleasureUseData,
  testMaritimeUseData,
} from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
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
    testMaritimeUseData.communications.satelliteTelephone
  );
  cy.get("main").contains(testMaritimeUseData.communications.mobileTelephone1);
  cy.get("main").contains(testMaritimeUseData.communications.mobileTelephone2);
  cy.get("main").contains(
    testMaritimeUseData.communications.otherCommunication
  );
  cy.get("main").contains(testMaritimeUseData.moreDetails);
};

export const givenIHaveEnteredInformationAboutMyVessel = (): void => {
  const vessel = testMaritimeUseData.vessel;
  givenIHaveTyped(vessel.maxCapacity, "#maxCapacity");
  givenIHaveTyped(vessel.name, "#vesselName");
  givenIHaveTyped(vessel.beaconPosition, "#beaconLocation");
  givenIHaveTyped(vessel.pln, "#portLetterNumber");
  givenIHaveTyped(vessel.homePort, "#homeport");
  givenIHaveTyped(vessel.typicalAO, "#areaOfOperation");
  givenIHaveTyped(vessel.imoNumber, "#imoNumber");
  givenIHaveTyped(vessel.ssrNumber, "#ssrNumber");
  givenIHaveTyped(vessel.rssNumber, "#rssNumber");
  givenIHaveTyped(vessel.officialNumber, "#officialNumber");
  givenIHaveTyped(vessel.rigPlatformLocation, "#rigPlatformLocation");
};

export const givenIHaveEnteredMyVesselCommunicationDetails = (): void => {
  const comms = testMaritimeUseData.communications;
  givenIHaveTyped(comms.callSign, "#callSign");
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#fixedVhfRadio");
  givenIHaveTyped(comms.fixedMMSI, "#fixedVhfRadioInput");
  givenIHaveSelected("#portableVhfRadio");
  givenIHaveTyped(comms.portableMMSI, "#portableVhfRadioInput");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(comms.satelliteTelephone, "#satelliteTelephoneInput");
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(comms.mobileTelephone1, "#mobileTelephoneInput1");
  givenIHaveTyped(comms.mobileTelephone2, "#mobileTelephoneInput2");
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(comms.otherCommunication, "#otherCommunicationInput");
};

export const givenIHaveEnteredMoreDetailsAboutMyVessel = (): void => {
  givenIHaveTyped(testMaritimeUseData.moreDetails, "#moreDetails");
};
