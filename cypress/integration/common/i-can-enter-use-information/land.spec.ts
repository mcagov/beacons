import { Environment } from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import { makeEnumValueUserFriendly } from "../../../../src/lib/utils";
import { testLandUseData } from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  iCanSeeAPageHeadingThatContains,
  thenTheUrlShouldContain,
} from "../selectors-and-assertions.spec";
import { iCanEditMyEnvironment } from "./generic.spec";

export const givenIHaveEnteredMyLandUse = (): void => {
  thenTheUrlShouldContain(PageURLs.environment);
  givenIHaveSelected("#land");
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.activity);
  iCanSeeAPageHeadingThatContains("land");
  givenIHaveSelected(`#${testLandUseData.type.activity.toLowerCase()}`);

  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.landCommunications);
  givenIHaveEnteredMyLandCommunicationDetails();
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.moreDetails);
  givenIHaveEnteredMoreDetailsAboutMyLandUse();
  andIClickContinue();
};

export const iCanEditMyLandCommunications = (): void => {
  const comms = testLandUseData.communications;
  comms.checkedFields.forEach((field) =>
    cy.get(`#${field}`).should("be.checked")
  );
  cy.get("#satelliteTelephoneInput").should(
    "contain.value",
    comms.satelliteTelephone
  );
  cy.get("#mobileTelephoneInput1").should(
    "contain.value",
    comms.mobileTelephone1
  );
  cy.get("#mobileTelephoneInput2").should(
    "contain.value",
    comms.mobileTelephone2
  );
  cy.get("#otherCommunicationInput").should(
    "contain.value",
    comms.otherCommunication
  );
};

export const iCanEditMyLandActivity = (): void => {
  cy.get(`input[value="${testLandUseData.type.activity}"]`).should(
    "be.checked"
  );
};

export const iCanEditMyAdditionalLandUseMoreDetails = (): void => {
  cy.get("textarea").should("contain.value", testLandUseData.moreDetails);
};

export const iCanSeeMyLandUse = (): void => {
  Object.values(testLandUseData.type).forEach((value) => {
    cy.get("main").contains(makeEnumValueUserFriendly(value));
  });
  cy.get("main").contains(testLandUseData.communications.satelliteTelephone);
  cy.get("main").contains(testLandUseData.communications.mobileTelephone1);
  cy.get("main").contains(testLandUseData.communications.mobileTelephone2);
  cy.get("main").contains(testLandUseData.communications.otherCommunication);
  cy.get("main").contains(testLandUseData.moreDetails);
};

const givenIHaveEnteredMyLandCommunicationDetails = (): void => {
  givenIHaveSelected("#portableVhfRadio");
  givenIHaveTyped(
    testLandUseData.communications.portableMMSI,
    "#portableVhfRadioInput"
  );
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(
    testLandUseData.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(
    testLandUseData.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTyped(
    testLandUseData.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(
    testLandUseData.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};

const givenIHaveEnteredMoreDetailsAboutMyLandUse = (): void => {
  givenIHaveTyped(testLandUseData.moreDetails, "#moreDetails");
};

export const iCanEditMyLandEnvironment = (): void =>
  iCanEditMyEnvironment(Environment.LAND);
