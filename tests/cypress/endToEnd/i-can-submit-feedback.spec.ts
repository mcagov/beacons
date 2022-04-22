import {
  andIClickTheButtonContaining,
  givenIHaveVisited,
  iCanSeeAPageHeadingThatContains,
  iHaveClickedOnALinkWithText,
  thenTheUrlPathShouldBe,
  whenISelect,
  whenITypeInAnEmptyField,
} from "../common/selectors-and-assertions.spec";

describe("As any user", () => {
  it("I can submit feedback", () => {
    givenIHaveVisited("/");
    iHaveClickedOnALinkWithText("feedback");
    iCanSeeAPageHeadingThatContains("Give feedback on Register a beacon");
    whenISelect("#verySatisfied");
    whenITypeInAnEmptyField(
      "Should have used Ruby on Rails",
      "#howCouldWeImproveThisService"
    );
    andIClickTheButtonContaining("Send feedback");
    iCanSeeAPageHeadingThatContains("Feedback submitted");
    andIClickTheButtonContaining("Go to service start page");
    thenTheUrlPathShouldBe("/");
  });
});
