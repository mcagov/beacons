import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import { testLandUseData } from "../common/happy-path-test-data.spec";
import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  givenIHaveSignedIn,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner and land or other use user", () => {
  const portableVhfDscRadioCheckboxSelector = "#portableVhfRadio";
  const portableVhfDscRadioInputSelector = "#portableVhfRadioInput";
  const satelliteTelephoneCheckboxSelector = "#satelliteTelephone";
  const satelliteTelephoneInputSelector = "#satelliteTelephoneInput";
  const mobileTelephoneCheckboxSelector = "#mobileTelephone";
  const mobileTelephoneInputSelector = "#mobileTelephoneInput1";
  const otherCommunicationSelector = "#otherCommunication";
  const otherCommunicationInputSelector = "#otherCommunicationInput";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(
      CreateRegistrationPageURLs.landCommunications
    );
  });

  describe("the Portable VHF/DSC radio option", () => {
    it("requires an MMSI number if the portable VHF checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "portable VHF"];
      givenIHaveSelected(portableVhfDscRadioCheckboxSelector);

      whenIType(" ", portableVhfDscRadioInputSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(portableVhfDscRadioInputSelector);
    });

    it("requires the portable MMSI number to be 9 characters long", () => {
      const expectedErrorMessage = [
        "portable",
        "MMSI number",
        "nine digits long",
      ];
      givenIHaveSelected(portableVhfDscRadioCheckboxSelector);

      whenIType("012345678910", portableVhfDscRadioInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(portableVhfDscRadioInputSelector);
    });

    it("requires the portable MMSI number to be numbers 0 to 9 only", () => {
      const expectedErrorMessage = [
        "portable",
        "MMSI number",
        "numbers",
        "0 to 9",
      ];
      givenIHaveSelected(portableVhfDscRadioCheckboxSelector);

      whenIType("9charslng", portableVhfDscRadioInputSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(portableVhfDscRadioInputSelector);
    });
  });

  describe("the Satellite telephone option", () => {
    it("requires a phone number if the satellite telephone checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "satellite telephone"];

      givenIHaveSelected(satelliteTelephoneCheckboxSelector);

      whenIType(" ", satelliteTelephoneInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(satelliteTelephoneInputSelector);
    });

    it("requires the satellite phone number to be valid", () => {
      const invalidSatelliteNumber = "+8816023456709"; // Too long
      const expectedErrorMessage = [
        "satellite telephone number",
        "correct format",
      ];

      givenIHaveSelected(satelliteTelephoneCheckboxSelector);

      whenIType(invalidSatelliteNumber, satelliteTelephoneInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(satelliteTelephoneInputSelector);
    });
  });

  describe("the Mobile telephone option", () => {
    it("requires a phone number if the mobile telephone checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "mobile telephone"];

      givenIHaveSelected(mobileTelephoneCheckboxSelector);

      whenIType(" ", mobileTelephoneInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(mobileTelephoneInputSelector);
    });

    it("requires the mobile phone number to be valid", () => {
      const tooLongMobileNumber = "+44 71234567891";
      const expectedErrorMessage = ["mobile telephone", "like"];

      givenIHaveSelected(mobileTelephoneCheckboxSelector);

      whenIType(tooLongMobileNumber, mobileTelephoneInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(mobileTelephoneInputSelector);
    });
  });

  describe("the Other communications option", () => {
    it("requires other communication if the other checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "other"];

      givenIHaveSelected(otherCommunicationSelector);

      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(otherCommunicationInputSelector);
    });

    it("requires other communication to be less than a certain number of characters if the other checkbox is selected", () => {
      const expectedErrorMessage = ["Other communication", "too many"];

      givenIHaveSelected(otherCommunicationSelector);

      whenIType("a".repeat(251), otherCommunicationInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(otherCommunicationInputSelector);
    });
  });

  it("submits the form if all fields are valid", () => {
    givenIHaveSelected(portableVhfDscRadioCheckboxSelector);
    givenIHaveSelected(satelliteTelephoneCheckboxSelector);
    givenIHaveSelected(mobileTelephoneCheckboxSelector);
    givenIHaveSelected(otherCommunicationSelector);

    whenIType(
      testLandUseData.communications.portableMMSI,
      portableVhfDscRadioInputSelector
    );
    whenIType(
      testLandUseData.communications.satelliteTelephone,
      satelliteTelephoneInputSelector
    );
    whenIType(
      testLandUseData.communications.mobileTelephone1,
      mobileTelephoneInputSelector
    );
    whenIType(
      testLandUseData.communications.otherCommunication,
      otherCommunicationInputSelector
    );
    andIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/more-details");
  });
});
