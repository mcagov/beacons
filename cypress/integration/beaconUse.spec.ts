import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "./common.spec";

describe("As a beacon owner, I want to submit uses for my beacon", () => {
  const previousPageUrl = "register-a-beacon/beacon-information";
  const pageUrl = "/register-a-beacon/beacon-use";
  const purposeUrl = "/register-a-beacon/purpose";
  const activityUrl = "/register-a-beacon/activity";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("should route to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("should route to the purpose page if maritime selected with the correct heading text", () => {
    givenIHaveSelected("#maritime");
    whenIClickContinue();

    iCanSeeAHeadingThatContains("maritime use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the purpose page if aviation selected", () => {
    givenIHaveSelected("#aviation");
    whenIClickContinue();

    iCanSeeAHeadingThatContains("aviation use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the activity page if land is selected", () => {
    givenIHaveSelected("#land");
    whenIClickContinue();

    thenTheUrlShouldContain(activityUrl);
  });

  it("should route to the activity page if other is selected", () => {
    givenIHaveSelected("#other");
    whenIClickContinue();

    thenTheUrlShouldContain(activityUrl);
  });
});
