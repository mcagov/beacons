import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner I want to submit more information about my beacon", () => {
  const thisPageUrl = "/register-a-beacon/more-details";
  const nextPageUrl = "/register-a-beacon/additional-beacon-use";

  const moreDetailsTextareaSelector = "#moreDetails";

  beforeEach(() => {
    givenIHaveSignedIn();
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
});
