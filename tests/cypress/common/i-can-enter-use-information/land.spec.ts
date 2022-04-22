import { testLandUseData } from "../happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTypedInAnEmptyField,
  iCanSeeAPageHeadingThatContains,
} from "../selectors-and-assertions.spec";
import { makeEnumValueUserFriendly } from "../writing-style.spec";

export const givenIHaveEnteredMyLandUse = (): void => {
  givenIHaveSelected("#land");
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("land");
  givenIHaveSelected(`#${testLandUseData.type.activity.toLowerCase()}`);

  andIClickContinue();

  givenIHaveEnteredMyLandCommunicationDetails();
  andIClickContinue();

  givenIHaveEnteredMoreDetailsAboutMyLandUse();
  andIClickContinue();
};

export const andIHaveEnteredMyLandUse = givenIHaveEnteredMyLandUse;

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

export const givenIHaveEnteredMyLandCommunicationDetails = (): void => {
  givenIHaveSelected("#portableVhfRadio");
  givenIHaveTypedInAnEmptyField(
    testLandUseData.communications.portableMMSI,
    "#portableVhfRadioInput"
  );
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTypedInAnEmptyField(
    testLandUseData.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTypedInAnEmptyField(
    testLandUseData.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTypedInAnEmptyField(
    testLandUseData.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTypedInAnEmptyField(
    testLandUseData.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};

const givenIHaveEnteredMoreDetailsAboutMyLandUse = (): void => {
  givenIHaveTypedInAnEmptyField(testLandUseData.moreDetails, "#moreDetails");
};
