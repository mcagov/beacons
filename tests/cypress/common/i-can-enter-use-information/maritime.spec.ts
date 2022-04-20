import {
  testMaritimeCommercialUseData,
  testMaritimePleasureUseData,
  testMaritimeUseData,
} from "../happy-path-test-data.spec";
import {
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyBeaconDetails,
} from "../i-can-enter-beacon-information.spec";
import {
  iCanEditMyAddressDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyPersonalDetails,
} from "../i-can-enter-owner-information.spec";
import {
  andIClickContinue,
  andIHaveVisited,
  givenIHaveSelected,
  givenIHaveTyped,
  givenIHaveUnselected,
  iCanSeeAPageHeadingThatContains,
  iHaveVisited,
  thenTheUrlShouldContain,
  whenIClearTheInput,
  whenIClickBack,
  whenIClickBackTimes,
} from "../selectors-and-assertions.spec";
import { makeEnumValueUserFriendly } from "../writing-style.spec";
import { iCanEditMyEnvironment, iCanEditMyNUses } from "./generic.spec";

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

export const givenIHaveEnteredMyRequiredMaritimeUse = (purpose): void => {
  thenTheUrlShouldContain("/register-a-beacon/beacon-use");
  givenIHaveSelected("#maritime");
  andIClickContinue();

  thenTheUrlShouldContain("/register-a-beacon/purpose");
  iCanSeeAPageHeadingThatContains("maritime");
  givenIHaveSelected(`#${purpose.toLowerCase()}`);
  andIClickContinue();

  thenTheUrlShouldContain("/register-a-beacon/activity");
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

  thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  iCanSeeAPageHeadingThatContains("vessel");
  givenIHaveEnteredRequiredInformationAboutMyVessel();
  andIClickContinue();

  thenTheUrlShouldContain("/register-a-beacon/vessel-communications");
  andIClickContinue();

  thenTheUrlShouldContain("/register-a-beacon/more-details");
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

export const iCanSeeMyRequiredMaritimeUse = (purpose): void => {
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
    cy.get("main").contains(new RegExp(value + "|-"));
  });
  cy.get("main").contains(testMaritimeUseData.moreDetails);
};

export const iCanGoBackAndEditMyMaritimeUse = (purpose): void => {
  whenIClickBack();
  iCanEditMyEmergencyContactDetails();
  whenIClickBack();
  iCanEditMyAddressDetails();
  // Go back twice due to branch
  whenIClickBackTimes(2);
  iCanEditMyPersonalDetails();
  whenIClickBack();
  iCanEditMyNUses(1);
  whenIClickBack();
  iCanEditMyAdditionalMaritimeUseInformation();
  whenIClickBack();
  iCanEditMyVesselCommunications();
  iCanChangeMyVesselCommunications();
  andIClickContinue();
  whenIClickBack();
  iCanViewMyChangedVesselCommunications();
  whenIClickBack();
  iCanEditMyVesselDetails();
  whenIClickBack();
  iCanEditMyMaritimeActivity();
  whenIClickBack();
  iCanEditMyMaritimePurpose(purpose);
  whenIClickBack();
  iCanEditMyEnvironment("MARITIME");
  whenIClickBack();
  iCanEditMyAdditionalBeaconInformation();
  whenIClickBack();
  iCanEditMyBeaconDetails();
  whenIClickBack();
  iHaveVisited("/");
};

export const iCanEditMyVesselCommunications = (): void => {
  const comms = testMaritimeUseData.communications;
  comms.checkedFields.forEach((field) =>
    cy.get(`#${field}`).should("be.checked")
  );
  cy.get("#callSign").should("have.value", comms.callSign);
  cy.get("#fixedVhfRadioInput").should("have.value", comms.fixedMMSI);
  cy.get("#portableVhfRadioInput").should("have.value", comms.portableMMSI);
  cy.get("#satelliteTelephoneInput").should(
    "have.value",
    comms.satelliteTelephone
  );
  cy.get("#mobileTelephoneInput1").should("have.value", comms.mobileTelephone1);
  cy.get("#mobileTelephoneInput2").should("have.value", comms.mobileTelephone2);
  cy.get("#otherCommunicationInput").contains(comms.otherCommunication);
};

export const iCanChangeMyVesselCommunications = (): void => {
  const comms = testMaritimeUseData.communications;
  whenIClearTheInput("#callSign");
  comms.checkedFields.forEach((field) => givenIHaveUnselected(`#${field}`));
};

export const iCanViewMyChangedVesselCommunications = (): void => {
  const comms = testMaritimeUseData.communications;

  comms.checkedFields.forEach((field) =>
    cy.get(`#${field}`).should("not.be.checked")
  );
  cy.get("#fixedVhfRadioInput").should("not.be.visible");
  cy.get("#portableVhfRadioInput").should("not.be.visible");
  cy.get("#satelliteTelephoneInput").should("not.be.visible");
  cy.get("#mobileTelephoneInput1").should("not.be.visible");
  cy.get("#mobileTelephoneInput2").should("not.be.visible");
  cy.get("#otherCommunicationInput").should("not.be.visible");
  andIClickContinue();
  cy.visit("/register-a-beacon/check-your-answers");
  Object.values(comms)
    .filter((value) => typeof value === "string")
    .forEach((value: string) =>
      cy.get(".govuk-summary-list__value").should("not.contain", value)
    );
  andIHaveVisited("/register-a-beacon/vessel-communications?useId=0");
};

export const iCanEditMyVesselDetails = (): void => {
  const vessel = testMaritimeUseData.vessel;
  cy.get("#maxCapacity").should("have.value", vessel.maxCapacity);
  cy.get("#vesselName").should("have.value", vessel.name);
  cy.get("#beaconLocation").should("have.value", vessel.beaconPosition);
  cy.get("#portLetterNumber").should("have.value", vessel.pln);
  cy.get("#homeport").should("have.value", vessel.homePort);
  cy.get("#areaOfOperation").should("have.value", vessel.typicalAO);
  cy.get("#imoNumber").should("have.value", vessel.imoNumber);
  cy.get("#ssrNumber").should("have.value", vessel.ssrNumber);
  cy.get("#officialNumber").should("have.value", vessel.officialNumber);
  cy.get("#rigPlatformLocation").should(
    "have.value",
    vessel.rigPlatformLocation
  );
};

export const iCanEditMyMaritimeActivity = (): void => {
  cy.get(
    `input[value="${testMaritimeCommercialUseData.type.activity}"]`
  ).should("be.checked");
};

export const iCanEditMyMaritimePurpose = (purpose): void => {
  switch (purpose) {
    case "COMMERCIAL":
      cy.get(
        `input[value="${testMaritimeCommercialUseData.type.purpose}"]`
      ).should("be.checked");
      break;
    case "PLEASURE":
      cy.get(
        `input[value="${testMaritimePleasureUseData.type.purpose}"]`
      ).should("be.checked");
      break;
  }
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

export const givenIHaveEnteredRequiredInformationAboutMyVessel = (): void => {
  const vessel = testMaritimeUseData.vessel;
  givenIHaveTyped(vessel.maxCapacity, "#maxCapacity");
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

export const iCanEditMyAdditionalMaritimeUseInformation = (): void => {
  cy.get("textarea").contains(testMaritimeUseData.moreDetails);
};

export const iCanEditMyMaritimeEnvironment = (): void =>
  iCanEditMyEnvironment("MARITIME");
