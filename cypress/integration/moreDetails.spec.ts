import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner I want to submit more information about my beacon", () => {
  const thisPageUrl = "/register-a-beacon/more-details";
  const nextPageUrl = "/register-a-beacon/additional-beacon-use";
  const previousPageUrl = "/register-a-beacon/vessel-communications";

  const moreDetailsTextareaSelector = "#moreDetails";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("requires at least one character in the More details field", () => {
    const expectedErrorMessage = ["More details", requiredFieldErrorMessage];

    whenIType(" ", moreDetailsTextareaSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(moreDetailsTextareaSelector);
  });

  it("errors if there are more than 250 characters in the More details field", () => {
    const expectedErrorMessage = ["More details", "250 characters"];

    whenIType("z".repeat(251), moreDetailsTextareaSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(moreDetailsTextareaSelector);
  });

  it("doesn't error if there are 250 or fewer characters in the More details field", () => {
    whenIType("z".repeat(250), moreDetailsTextareaSelector);
    andIClickContinue();
    thenTheUrlShouldContain(nextPageUrl);
  });

  it("submits the form if all fields are valid", () => {
    whenIType("My ship is blue with red sails", moreDetailsTextareaSelector);
    andIClickContinue();
    thenTheUrlShouldContain(nextPageUrl);
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });
});
