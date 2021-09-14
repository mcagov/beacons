import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  iCanSeeAPageHeadingThatContains,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to enter my initial beacon information", () => {
  const pageUrl = "/register-a-beacon/check-beacon-details";
  const manufacturerFieldSelector = "#manufacturer";
  const modelFieldSelector = "#model";
  const hexIdFieldSelector = "#hexId";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("shows me the page title", () => {
    iCanSeeAPageHeadingThatContains("Check beacon details");
  });

  it("errors if I submit just whitespace in the manufacturer field", () => {
    whenIType(" ", manufacturerFieldSelector);

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains("manufacturer", "required");
    thenIShouldSeeAnErrorMessageThatContains("manufacturer", "required");

    whenIClickOnTheErrorSummaryLinkContaining("manufacturer", "required");
    thenMyFocusMovesTo(manufacturerFieldSelector);
  });

  it("errors if I submit just whitespace in the model field", () => {
    whenIType(" ", modelFieldSelector);

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains("model", "required");
    thenIShouldSeeAnErrorMessageThatContains("model", "required");

    whenIClickOnTheErrorSummaryLinkContaining("model", "required");
    thenMyFocusMovesTo(modelFieldSelector);
  });

  describe("the HEX ID field", () => {
    it("errors if I submit just whitespace string", () => {
      const expectedErrorMessage = ["HEX ID", "required"];

      whenIType(" ", "#hexId");
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });

    it("errors if I submit a non-hexadecimal string", () => {
      const expectedErrorMessage = ["HEX ID", "0 to 9", "A to F"];

      whenIType("0123456789ABCDX", "#hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });

    it("errors if I submit a string not exactly 15 characters long", () => {
      const expectedErrorMessage = ["15 characters"];

      whenIType("0123456789ABCDEF", "#hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });

    it("errors if I submit a valid but non-UK HEX ID", () => {
      const newZealandBeaconHexId = "C00F429578002C1";
      const expectedErrorMessage = ["UK-encoded", "New Zealand"];

      whenIType(newZealandBeaconHexId, "#hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });

    it("errors if I submit a valid but a hexadecimal number that has an unknown country encoding", () => {
      const newZealandBeaconHexId = "12345678910ABCD";
      const expectedErrorMessage = "an unknown country";

      whenIType(newZealandBeaconHexId, "#hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });

    it("reminds me to check for mixed up 'O's and '0's", () => {
      const expectedErrorMessage = ["O", "Did you mean", "zero"];
      const almostValidHexIdButWithOhInsteadOfZero = "1DOEAO8C52FFBFF";

      whenIType(almostValidHexIdButWithOhInsteadOfZero, "#hexId");
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdFieldSelector);
    });
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    const validUkEncodedHexId = "1D0EA08C52FFBFF";

    whenIType("Test Manufacturer", "#manufacturer");
    whenIType("Test Model", "#model");
    whenIType(validUkEncodedHexId, "#hexId");

    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/beacon-information");
  });
});
