import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  givenIHaveACookieSetAndIVisit,
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
