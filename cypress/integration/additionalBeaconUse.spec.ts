import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeFormErrors,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "./common.spec";

describe("As a beacon owner, I want to register multiple uses for my beacon", () => {
  const pageUrl = "/register-a-beacon/additional-beacon-use";
  const previousPageUrl = "/register-a-beacon/more-details";
  const additionalBeaconUseUrl = "/register-a-beacon/beacon-use";
  const beaconOwnerUrl = "/register-a-beacon/about-beacon-owner";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("should navigate back to the more details page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("should display errors if the user has not selected an answer", () => {
    const expectedErrorMessages = ["Additional beacon use", "required"];
    whenIClickContinue();

    thenIShouldSeeFormErrors(...expectedErrorMessages);
  });

  it("should route to register an additional beacon if yes is selected", () => {
    givenIHaveSelected("#yes");
    whenIClickContinue();

    thenTheUrlShouldContain(`${additionalBeaconUseUrl}?useIndex=1`);
  });

  it("should route to adding beacon owner details if no is selected", () => {
    givenIHaveSelected("#no");
    whenIClickContinue();

    thenTheUrlShouldContain(beaconOwnerUrl);
  });
});
