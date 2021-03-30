import {
  givenIAmAt,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeFormErrors,
  whenIClickContinue,
} from "./common.spec";

describe("As a beacon owner, I want to register multiple uses for my beacon", () => {
  const pageUrl = "/register-a-beacon/additional-beacon-use";
  const previousPageUrl = "/register-a-beacon/more-details";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("should navigate back to the more details page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("should display errors if the user has not selected an answer", () => {
    const expectedErrorMessage = ["Additional use", "required"];
    whenIClickContinue();

    thenIShouldSeeFormErrors();
  });
});
