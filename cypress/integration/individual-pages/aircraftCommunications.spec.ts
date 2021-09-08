import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  givenIHaveSignedIn,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to register details about the aircraft communications", () => {
  const pageUrl = "/register-a-beacon/aircraft-communications";
  const previousPageUrl = "/register-a-beacon/about-the-aircraft";
  const vhfRadioCheckboxSelector = "#vhfRadio";
  const satelliteTelephoneCheckboxSelector = "#satelliteTelephone";
  const satelliteTelephoneInputSelector = "#satelliteTelephoneInput";
  const mobileTelephoneCheckboxSelector = "#mobileTelephone";
  const mobileTelephoneInputSelector = "#mobileTelephoneInput1";
  const otherCommunicationCheckboxSelector = "#otherCommunication";
  const otherCommunicationInputSelector = "#otherCommunicationInput";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("submits the form if all fields are valid", () => {
    const validPhoneNumber = "07887662534";

    givenIHaveSelected(vhfRadioCheckboxSelector);
    givenIHaveSelected(satelliteTelephoneCheckboxSelector);
    givenIHaveSelected(mobileTelephoneCheckboxSelector);
    givenIHaveSelected(otherCommunicationCheckboxSelector);

    whenIType(validPhoneNumber, satelliteTelephoneInputSelector);
    whenIType(validPhoneNumber, mobileTelephoneInputSelector);
    whenIType("Other comms", otherCommunicationInputSelector);
    andIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/more-details");
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

      givenIHaveSelected(otherCommunicationCheckboxSelector);

      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(otherCommunicationInputSelector);
    });

    it("requires other communication to be less than a certain number of characters if the other checkbox is selected", () => {
      const expectedErrorMessage = ["Other communication", "too many"];

      givenIHaveSelected(otherCommunicationCheckboxSelector);

      whenIType("a".repeat(251), otherCommunicationInputSelector);
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(otherCommunicationInputSelector);
    });
  });
});
