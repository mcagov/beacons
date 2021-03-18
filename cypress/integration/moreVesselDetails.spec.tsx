import {
  andIClickContinue,
  givenIAmAt,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner and maritime pleasure vessel user", () => {
  const thisPageUrl = "/register-a-beacon/more-details";
  const nextPageUrl = "/register-a-beacon/about-beacon-owner";
  const previousPageUrl = "/register-a-beacon/vessel-communications";

  const moreVesselDetailsTextareaSelector = "#moreVesselDetails";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("requires at least one character in the More vessel details field", () => {
    const expectedErrorMessage = ["Vessel details", requiredFieldErrorMessage];

    whenIType(" ", moreVesselDetailsTextareaSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(moreVesselDetailsTextareaSelector);
  });

  it("errors if there are more than 250 characters in the More vessel details field", () => {
    const expectedErrorMessage = ["Vessel details", "250 characters"];

    whenIType("z".repeat(251), moreVesselDetailsTextareaSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(moreVesselDetailsTextareaSelector);
  });

  it("doesn't error if there are 250 or fewer characters in the More vessel details field", () => {
    whenIType("z".repeat(250), moreVesselDetailsTextareaSelector);
    andIClickContinue();
    thenTheUrlShouldContain(nextPageUrl);
  });

  it("submits the form if all fields are valid", () => {
    whenIType(
      "My ship is blue with red sails",
      moreVesselDetailsTextareaSelector
    );
    andIClickContinue();
    thenTheUrlShouldContain(nextPageUrl);
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });
});
