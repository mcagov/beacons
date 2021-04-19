import { givenIHaveFilledInCheckBeaconDetailsPage } from "../common/i-can-enter-beacon-information.spec";
import {
  andIAmAt,
  givenIHaveACookieSetAndIVisit,
  givenIHaveClicked,
  iCanSeeAPageHeadingThatContains,
  thenTheInputShouldOnlyContain,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const checkYourAnswerspageUrl = "/register-a-beacon/check-your-answers";
  const beaconInformationPageUrl = "/register-a-beacon/beacon-information";
  const applicationCompletePageUrl = "/register-a-beacon/application-complete";

  const acceptAndSendButtonSelector = ".govuk-button--start";
  const homePageLinkSelector = ".govuk-header__link--homepage";
  const startButtonSelector = ".govuk-button--start";
  const manufacturerFieldSelector = "#manufacturer";
  const modelFieldSelector = "#model";
  const hexIdFieldSelector = "#hexId";

  it("should display the page title", () => {
    givenIHaveACookieSetAndIVisit(checkYourAnswerspageUrl);
    iCanSeeAPageHeadingThatContains("Check your answers");
  });

  it("should clear the form when I click Accept and Send", () => {
    givenIHaveACookieSetAndIVisit(beaconInformationPageUrl);
    givenIHaveFilledInCheckBeaconDetailsPage();
    andIAmAt(checkYourAnswerspageUrl);
    givenIHaveClicked(acceptAndSendButtonSelector);
    andIAmAt(applicationCompletePageUrl);
    givenIHaveClicked(homePageLinkSelector);
    andIAmAt("/");
    givenIHaveClicked(startButtonSelector);
    thenTheInputShouldOnlyContain("", manufacturerFieldSelector);
    thenTheInputShouldOnlyContain("", modelFieldSelector);
    thenTheInputShouldOnlyContain("", hexIdFieldSelector);
  });
});
