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
  const aboutTheAircraftUrl = "/register-a-beacon/about-the-aircraft";

  describe("adding a beacon use directs me along a page flow relevant to me", () => {
    it("Maritime environment -> Pleasure purpose -> Rowing activity", () => {
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

    it("Maritime environment -> Commercial purpose -> Fishing activity", () => {
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

    it("Aviation environment -> Pleasure purpose -> Jet aircraft activity", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#aviation");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");

      givenIHaveSelected("#pleasure");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("pleasure");

      givenIHaveSelected("#jet-aircraft");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
    });

    it("Aviation environment -> Commercial purpose -> Passenger plane activity", () => {
      givenIAmAt(environmentUrl);
      givenIHaveSelected("#aviation");
      andIClickContinue();
      thenTheUrlShouldContain(purposeUrl);
      iCanSeeAHeadingThatContains("aviation");

      givenIHaveSelected("#commercial");
      andIClickContinue();
      thenTheUrlShouldContain(activityUrl);
      iCanSeeAHeadingThatContains("aviation");
      iCanSeeAHeadingThatContains("commercial");

      givenIHaveSelected("#passenger-plane");
      andIClickContinue();
      thenTheUrlShouldContain(aboutTheAircraftUrl);
      iCanSeeAHeadingThatContains("aircraft");
    });
  });
});
