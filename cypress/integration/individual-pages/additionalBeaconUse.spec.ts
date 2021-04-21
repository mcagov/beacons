import { PageURLs } from "../../../src/lib/urls";
import { andIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import { givenIHaveEnteredMyLandUse } from "../common/i-can-enter-use-information/land.spec";
import {
  givenIAmAt,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  thenIShouldSeeFormErrors,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to register multiple uses for my beacon", () => {
  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(PageURLs.additionalUse);
  });

  it("should navigate back to the more details page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(PageURLs.moreDetails);
  });

  it("should display errors if the user has not selected an answer", () => {
    const expectedErrorMessages = ["Additional beacon use", "required"];
    whenIClickContinue();

    thenIShouldSeeFormErrors(...expectedErrorMessages);
  });

  it("should route to register an additional beacon if yes is selected", () => {
    givenIHaveSelected("#yes");
    whenIClickContinue();

    thenTheUrlShouldContain(`${PageURLs.environment}?useIndex=1`);
  });

  it("should route to adding beacon owner details if no is selected", () => {
    givenIHaveSelected("#no");
    whenIClickContinue();

    thenTheUrlShouldContain(PageURLs.aboutBeaconOwner);
  });

  it("should redirect the user to update a new use if the use they are currently updating is not the latest use", () => {
    givenIAmAt(PageURLs.environment);
    givenIHaveEnteredMyLandUse();
    andIHaveAnotherUse();
    givenIHaveEnteredMyLandUse();

    givenIAmViewingTheAdditionalBeaconUsePageForMyFirstUse();
    whenIClickContinue();

    thenNoUseShouldBeSelected();
  });

  const givenIAmViewingTheAdditionalBeaconUsePageForMyFirstUse = () => {
    givenIAmAt(`${PageURLs.additionalUse}?useIndex=0`);
  };

  const thenNoUseShouldBeSelected = () => {
    cy.get("form").within(() => {
      cy.get("input").should("not.be.checked");
    });
  };
});
