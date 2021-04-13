import {
  givenIHaveACookieSetAndIVisit,
  iCanSeeAHeadingThatContains,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const pageUrl = "/register-a-beacon/check-your-answers";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("should display the page title", () => {
    iCanSeeAHeadingThatContains("Check your answers");
  });
});
