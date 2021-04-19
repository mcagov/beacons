import { givenIHaveFilledInCheckBeaconDetailsPage } from "../common/i-can-enter-beacon-information.spec";
import {
  andIAmAt,
  givenIHaveACookieSetAndIVisit,
  givenIHaveClicked,
  iCanSeeAPageHeadingThatContains,
  thenTheInputShouldOnlyContain,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const pageUrl = "/register-a-beacon/check-your-answers";
  const manufacturerFieldSelector = "#manufacturer";
  const modelFieldSelector = "#model";
  const hexIdFieldSelector = "#hexId";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("should display the page title", () => {
    iCanSeeAPageHeadingThatContains("Check your answers");
  });

  it("should clear the Submission ID and cache when I click Accept and Send", () => {
    givenIHaveACookieSetAndIVisit("/register-a-beacon/beacon-information");
    givenIHaveFilledInCheckBeaconDetailsPage();
    andIAmAt(pageUrl);
    givenIHaveClicked(".govuk-button--start");
    andIAmAt("/register-a-beacon/application-complete");
    givenIHaveClicked(".govuk-header__link--homepage");
    andIAmAt("/");
    givenIHaveClicked(".govuk-button--start");
    thenTheInputShouldOnlyContain("", manufacturerFieldSelector);
    thenTheInputShouldOnlyContain("", modelFieldSelector);
    thenTheInputShouldOnlyContain("", hexIdFieldSelector);
  });
});
