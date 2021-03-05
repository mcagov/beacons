import {
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenTheInputShouldContain,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit information about my beacon", () => {
  const pageLocation = "/register-a-beacon/beacon-information";
  const mustBeAfter1980ErrorMessage = "must be after 1980";
  const dateInThePastErrorMessage = "date in the past";

  beforeEach(() => {
    givenIAmOnTheBeaconInformationPage();
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("ASOS", "manufacturerSerialNumber");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/primary-beacon-use");
  });

  it("displays errors if no manufacturer serial number is submitted", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("adds a leading zero to the battery expiry and last serviced month", () => {
    whenIType("1", "batteryExpiryDateMonth");
    whenIType("1", "lastServicedDateMonth");
    whenIClickContinue();

    thenTheInputShouldContain("01", "batteryExpiryDateMonth");
    thenTheInputShouldContain("01", "lastServicedDateMonth");
  });

  it("displays errors if the battery expiry date is invalid", () => {
    whenIType("01", "batteryExpiryDateMonth");
    whenIType("202n", "batteryExpiryDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorMessageThatContains("complete battery expiry date");
  });

  it("displays errors if the battery expiry date is a valid date but before 1980", () => {
    whenIType("01", "batteryExpiryDateMonth");
    whenIType("1979", "batteryExpiryDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorMessageThatContains(mustBeAfter1980ErrorMessage);
  });

  it("displays errors if the last serviced date is invalid", () => {
    whenIType("01", "lastServicedDateMonth");
    whenIType("202n", "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorMessageThatContains("complete last serviced date");
  });

  it("displays errors if the last serviced date is a valid date but before 1980", () => {
    whenIType("01", "lastServicedDateMonth");
    whenIType("1979", "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorMessageThatContains(mustBeAfter1980ErrorMessage);
  });

  it("displays errors if the last serviced date in the future", () => {
    const date = new Date();
    const futureYear = date.getFullYear() + 1;
    whenIType(`${date.getMonth()}`, "lastServicedDateMonth");
    whenIType(`${futureYear}`, "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorMessageThatContains(dateInThePastErrorMessage);
  });

  const givenIAmOnTheBeaconInformationPage = () => {
    cy.visit("/");
    cy.visit(pageLocation);
  };
});
