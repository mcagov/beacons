import {
  givenIHaveSelected,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit my primary beacon use", () => {
  const pageLocation = "/register-a-beacon/primary-beacon-use";

  beforeEach(() => {
    givenIAmOnThePrimaryBeaconUsePage();
  });

  it("displays an error if no primary beacon use is selected", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("routes to the next page if there are no errors with the selected primary beacon use", () => {
    givenIHaveSelected("#motor-vessel");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });

  it("displays an error if 'Other pleasure vessel' is selected, but no text is provided", () => {
    givenIHaveSelected("#other-pleasure-vessel");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("routes to the next page if there are no errors with Other pleasure vessel selected", () => {
    givenIHaveSelected("#other-pleasure-vessel");
    whenIType("Surfboard", "otherPleasureVesselText");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });

  const givenIAmOnThePrimaryBeaconUsePage = () => {
    cy.visit("/");
    cy.visit(pageLocation);
  };
});
