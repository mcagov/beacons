import { PageURLs } from "../../../src/lib/urls";
import { givenIHaveFilledInCheckBeaconDetailsPage } from "../common/i-can-enter-beacon-information.spec";
import {
  andIAmAt,
  givenIHaveACookieSetAndIVisit,
  givenIHaveClicked,
  iCanSeeAPageHeadingThatContains,
  thenTheInputShouldOnlyContain,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const acceptAndSendButtonSelector = ".govuk-button--start";
  const homePageLinkSelector = ".govuk-header__link--homepage";
  const startButtonSelector = ".govuk-button--start";
  const manufacturerFieldSelector = "#manufacturer";
  const modelFieldSelector = "#model";
  const hexIdFieldSelector = "#hexId";

  it("should display the page title", () => {
    givenIHaveACookieSetAndIVisit(PageURLs.checkYourAnswers);
    iCanSeeAPageHeadingThatContains("Check your answers");
  });

  it.only("should clear the form when I click Accept and Send", () => {
    givenIHaveACookieSetAndIVisit(PageURLs.beaconInformation);
    givenIHaveFilledInCheckBeaconDetailsPage();
    andIAmAt(PageURLs.checkYourAnswers);
    givenIHaveClicked(acceptAndSendButtonSelector);
    andIAmAt(PageURLs.applicationComplete);
    givenIHaveClicked(homePageLinkSelector);
    andIAmAt(PageURLs.start);
    givenIHaveClicked(startButtonSelector);
    thenTheInputShouldOnlyContain("", manufacturerFieldSelector);
    thenTheInputShouldOnlyContain("", modelFieldSelector);
    thenTheInputShouldOnlyContain("", hexIdFieldSelector);
  });
});
