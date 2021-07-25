import { PageURLs } from "../../../src/lib/urls";
import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAPageHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit uses for my beacon", () => {
  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(PageURLs.environment);
  });

  it("should execute to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(PageURLs.beaconInformation);
  });

  it("should execute to the purpose page if maritime selected with the correct heading text", () => {
    givenIHaveSelected("#maritime");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("maritime use");
    thenTheUrlShouldContain(PageURLs.purpose);
  });

  it("should execute to the purpose page if aviation selected", () => {
    givenIHaveSelected("#aviation");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("aviation use");
    thenTheUrlShouldContain(PageURLs.purpose);
  });

  it("should execute to the activity page if land is selected", () => {
    givenIHaveSelected("#land");
    whenIClickContinue();

    thenTheUrlShouldContain(PageURLs.activity);
  });
});
