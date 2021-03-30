import { givenIAmAt, iCanSeeAHeadingThatContains } from "./common.spec";

describe("As a beacon owner, I want to check the details that were submitted", () => {
  const pageUrl = "/register-a-beacon/check-your-answers";
  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("should display the page title", () => {
    iCanSeeAHeadingThatContains("Check your answers");
  });
});
