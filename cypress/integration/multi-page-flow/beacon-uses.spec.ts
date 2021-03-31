import {
  andIClickContinue,
  givenIAmAt,
  givenIHaveSelected,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
} from "../common.spec";

describe("As a beacon owner in the maritime environment,", () => {
  const environmentUrl = "/register-a-beacon/beacon-use";
  const purposeUrl = "/register-a-beacon/purpose";
  const activityUrl = "/register-a-beacon/activity";

  const aboutTheVesselUrl = "/register-a-beacon/about-the-vessel";

  describe("adding a beacon use directs me along a page flow relevant to me", () => {
    it("directs me to the correct Purpose and Activity pages", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#maritime");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");

      givenIHaveSelected("#pleasure");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("pleasure");

      givenIHaveSelected("#rowing-vessel");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");
    });

    it("directs me to the correct Purpose and Activity pages", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#maritime");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("maritime");

      givenIHaveSelected("#commercial");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("maritime");
      iCanSeeAHeadingThatContains("commercial");

      givenIHaveSelected("#fishing-vessel");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheVesselUrl);
      iCanSeeAHeadingThatContains("vessel");
    });
  });
});
