import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveFilledInCheckBeaconDetailsPage,
  iCanEditMyBeaconDetails,
} from "../common/i-can-enter-beacon-information.spec";
import {
  andIAmAt,
  givenIHaveACookieSetAndIVisit,
  givenIHaveClicked,
  givenIHaveSignedIn,
  iCanSeeAPageHeadingThatContains,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const acceptAndSendButtonSelector = ".govuk-button--start";
  const homePageLinkSelector = ".govuk-header__link--service-name";
  const startButtonSelector = ".govuk-button--start";

  it("should display the page title", () => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeAPageHeadingThatContains("Check your answers");
  });

  it("should not clear the form when I click Accept and Send and the registration fails", () => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(CreateRegistrationPageURLs.beaconInformation);
    givenIHaveFilledInCheckBeaconDetailsPage();
    andIAmAt(CreateRegistrationPageURLs.checkYourAnswers);
    givenIHaveClicked(acceptAndSendButtonSelector);
    andIAmAt(CreateRegistrationPageURLs.applicationComplete);
    cy.get("div").contains("There was an error while registering your beacon");
    givenIHaveClicked(homePageLinkSelector);
    andIAmAt(GeneralPageURLs.start);
    givenIHaveClicked(startButtonSelector);
    andIAmAt(CreateRegistrationPageURLs.checkBeaconDetails);
    iCanEditMyBeaconDetails();
  });
});
