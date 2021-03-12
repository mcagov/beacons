import {
  andIClickContinue,
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContainingText,
  whenIType,
} from "./common.spec";

describe("As a beacon owner and maritime pleasure vessel user", () => {
  const pageUrl = "/register-a-beacon/vessel-communications";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  describe("the Fixed VHF/DSC radio option", () => {
    it("requires an MMSI number if the fixed VHF/DSC radio checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "fixed VHF"];
      givenIHaveSelected("#fixedVhfRadio");

      whenIType(" ", "fixedVhfRadioInput");
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("fixedVhfRadioInput");
    });

    it("requires the fixed MMSI number to be 9 characters long", () => {
      const expectedErrorMessage = ["MMSI number", "nine digits long"];
      givenIHaveSelected("#fixedVhfRadio");

      whenIType("012345678910", "fixedVhfRadioInput");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("fixedVhfRadioInput");
    });

    it("requires the fixed MMSI number to be numbers 0 to 9 only", () => {
      const expectedErrorMessage = ["MMSI number", "numbers", "0 to 9"];
      givenIHaveSelected("#fixedVhfRadio");

      whenIType("9charslng", "fixedVhfRadioInput");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("fixedVhfRadioInput");
    });
  });

  describe("the Portable VHF/DSC radio option", () => {
    it("requires an MMSI number if the portable VHF checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "portable VHF"];
      givenIHaveSelected("#portableVhfRadio");

      whenIType(" ", "portableVhfRadioInput");
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("portableVhfRadioInput");
    });

    it("requires the portable MMSI number to be 9 characters long", () => {
      const expectedErrorMessage = [
        "portable",
        "MMSI number",
        "nine digits long",
      ];
      givenIHaveSelected("#portableVhfRadio");

      whenIType("012345678910", "portableVhfRadioInput");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("portableVhfRadioInput");
    });

    it("requires the portable MMSI number to be numbers 0 to 9 only", () => {
      const expectedErrorMessage = [
        "portable",
        "MMSI number",
        "numbers",
        "0 to 9",
      ];
      givenIHaveSelected("#portableVhfRadio");

      whenIType("9charslng", "portableVhfRadioInput");
      andIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("portableVhfRadioInput");
    });
  });

  describe("the Satellite telephone option", () => {
    it("requires a phone number if the satellite telephone checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "satellite telephone"];

      givenIHaveSelected("#satelliteTelephone");

      whenIType(" ", "satelliteTelephoneInput");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("satelliteTelephoneInput");
    });

    it("requires the satellite phone number to be valid", () => {
      const invalidSatelliteNumber = "+8816023456709"; // Too long
      const expectedErrorMessage = [
        "satellite telephone number",
        "correct format",
      ];

      givenIHaveSelected("#satelliteTelephone");

      whenIType(invalidSatelliteNumber, "satelliteTelephoneInput");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("satelliteTelephoneInput");
    });
  });

  describe("the Mobile telephone option", () => {
    it("requires a phone number if the mobile telephone checkbox is selected", () => {
      const expectedErrorMessage = ["We need", "mobile telephone"];

      givenIHaveSelected("#mobileTelephone");

      whenIType(" ", "mobileTelephoneInput1");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("mobileTelephoneInput1");
    });

    it("requires the mobile phone number to be valid", () => {
      const tooLongMobileNumber = "+44 71234567891";
      const expectedErrorMessage = ["mobile telephone", "like"];

      givenIHaveSelected("#mobileTelephone");

      whenIType(tooLongMobileNumber, "mobileTelephoneInput1");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo("mobileTelephoneInput1");
    });
  });

  it("submits the form if all fields are valid", () => {
    const validMMSI = "123456789";
    const validPhoneNumber = "07887662534";

    givenIHaveSelected("#fixedVhfRadio");
    givenIHaveSelected("#portableVhfRadio");
    givenIHaveSelected("#satelliteTelephone");
    givenIHaveSelected("#mobileTelephone");

    whenIType(validMMSI, "fixedVhfRadioInput");
    whenIType(validMMSI, "portableVhfRadioInput");
    whenIType(validPhoneNumber, "satelliteTelephoneInput");
    whenIType(validPhoneNumber, "mobileTelephoneInput1");
    andIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/more-vessel-details");
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(
      "/register-a-beacon/about-the-vessel"
    );
  });
});
