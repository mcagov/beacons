import {
  CreateRegistrationPageURLs,
  GeneralPageURLs,
} from "../../../src/lib/urls";
import {
  givenIHaveFilledInCheckBeaconDetailsPage,
  iCanEditMyBeaconDetails,
} from "../../common/i-can-enter-beacon-information.spec";
import {
  andIHaveVisited,
  givenIHaveACookieSetAndIVisit,
  givenIHaveClicked,
  givenIHaveSignedIn,
  iCanSeeAPageHeadingThatContains,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  it("should display the page title", () => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(CreateRegistrationPageURLs.checkYourAnswers);
    iCanSeeAPageHeadingThatContains("Check your answers");
  });
});
