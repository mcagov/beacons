import {
  andIClickContinue,
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to register how I use my beacon in the land/other environment", () => {
  const thisPageUrl = "/register-a-beacon/land-other";
  const previousPageUrl = "/register-a-beacon/beacon-use";
  const nextPageUrl = "/register-a-beacon/land-other-communication";

  const drivingSelector = "#driving";
  const cyclingSelector = "#cycling";
  const workingRemotelySelector = "#workingRemotely";
  const workingRemotelyLocationSelector = "#workingRemotelyLocation";
  const workingRemotelyPeopleCountSelector = "#workingRemotelyPeopleCount";
  const windfarmSelector = "#windfarm";
  const windfarmLocationSelector = "#windfarmLocation";
  const windfarmPeopleCountSelector = "#windfarmPeopleCount";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("submits the form if all fields are valid", () => {
    givenIHaveSelected(drivingSelector);
    givenIHaveSelected(cyclingSelector);

    andIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  describe("the Working remotely option", () => {
    it("requires a location if the working remotely checkbox is selected", () => {
      const expectedErrorMessage = ["Enter the location", "work remotely"];

      givenIHaveSelected(workingRemotelySelector);
      whenIType(" ", workingRemotelyLocationSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(workingRemotelyLocationSelector);
    });

    it("requires a people count if the working remotely checkbox is selected", () => {
      const requiredFieldErrorMessage = [
        "Enter how many",
        "people",
        "work remotely",
      ];
      const mustBeANumberErrormessage = [
        "Enter a whole number",
        "people",
        "work remotely",
      ];

      givenIHaveSelected(workingRemotelySelector);

      whenIType(" ", workingRemotelyPeopleCountSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...requiredFieldErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...requiredFieldErrorMessage);
      thenMyFocusMovesTo(workingRemotelyPeopleCountSelector);

      whenIType("not a number", workingRemotelyPeopleCountSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...mustBeANumberErrormessage);
      whenIClickOnTheErrorSummaryLinkContaining(...mustBeANumberErrormessage);
      thenMyFocusMovesTo(workingRemotelyPeopleCountSelector);
    });
  });

  describe("the Windfarm option", () => {
    it("requires a location if the Windfarm checkbox is selected", () => {
      const expectedErrorMessage = ["Enter the location", "windfarm"];

      givenIHaveSelected(windfarmSelector);
      whenIType(" ", windfarmLocationSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(windfarmLocationSelector);
    });

    it("requires a people count if the Windfarm checkbox is selected", () => {
      const requiredFieldErrorMessage = [
        "Enter how many",
        "people",
        "windfarm",
      ];
      const mustBeANumberErrormessage = [
        "Enter a whole number",
        "people",
        "windfarm",
      ];

      givenIHaveSelected(windfarmSelector);

      whenIType(" ", windfarmPeopleCountSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...requiredFieldErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...requiredFieldErrorMessage);
      thenMyFocusMovesTo(windfarmPeopleCountSelector);

      whenIType("not a number", windfarmPeopleCountSelector);
      andIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(...mustBeANumberErrormessage);
      whenIClickOnTheErrorSummaryLinkContaining(...mustBeANumberErrormessage);
      thenMyFocusMovesTo(windfarmPeopleCountSelector);
    });
  });
});
