import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  givenIHaveSignedIn,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAPageHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit uses for my beacon", () => {
  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(CreateRegistrationPageURLs.environment);
  });

  it("should route to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(
      CreateRegistrationPageURLs.beaconInformation
    );
  });

  it("should route to the purpose page if maritime selected with the correct heading text", () => {
    givenIHaveSelected("#maritime");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("maritime use");
    thenTheUrlShouldContain(CreateRegistrationPageURLs.purpose);
  });

  it("should route to the purpose page if aviation selected", () => {
    givenIHaveSelected("#aviation");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("aviation use");
    thenTheUrlShouldContain(CreateRegistrationPageURLs.purpose);
  });

  it("should route to the activity page if land is selected", () => {
    givenIHaveSelected("#land");
    whenIClickContinue();

    thenTheUrlShouldContain(CreateRegistrationPageURLs.activity);
  });
});
