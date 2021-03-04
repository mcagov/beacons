describe("As a beacon owner, I want to submit information about my beacon", () => {
  const pageLocation = "/register-a-beacon/beacon-information";

  beforeEach(() => {
    givenIAmOnTheBeaconInformationPage();
  });

  it("displays errors if no manufacturer serial number is submitted", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorWithMessage("Beacon manufacturer is a required field");
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
    whenIType("beacon", "batteryExpiryDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorWithMessage("Enter a complete battery expiry date");
  });

  it("displays errors if the battery expiry date is a valid date but before 1980", () => {
    whenIType("01", "batteryExpiryDateMonth");
    whenIType("1979", "batteryExpiryDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorWithMessage("Battery expiry date must be after 1980");
  });

  it("displays errors if the last serviced date is invalid", () => {
    whenIType("01", "lastServicedDateMonth");
    whenIType("beacon", "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorWithMessage("Enter a complete last serviced date");
  });

  it("displays errors if the last serviced date is a valid date but before 1980", () => {
    whenIType("01", "lastServicedDateMonth");
    whenIType("1979", "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorWithMessage("Last serviced date must be after 1980");
  });

  it("displays errors if the last serviced date in the future", () => {
    const date = new Date();
    const futureYear = date.getFullYear() + 1;
    whenIType(`${date.getMonth()}`, "lastServicedDateMonth");
    whenIType(`${futureYear}`, "lastServicedDateYear");
    whenIClickContinue();

    thenIShouldSeeAnErrorWithMessage("Enter a last serviced date in the past");
  });

  const givenIAmOnTheBeaconInformationPage = () => {
    cy.visit("/");
    cy.visit(pageLocation);
  };

  const whenIType = (value: string, inputName: string) => {
    cy.get(`input[name="${inputName}"]`).type(value);
  };

  const whenIClickContinue = () =>
    cy.get("button").contains("Continue").click();

  const thenIShouldSeeAnErrorWithMessage = (errorMessage: string) => {
    cy.get("a").should("contain", errorMessage);
  };

  const thenTheInputShouldContain = (
    expectedValue: string,
    inputName: string
  ) => {
    cy.get(`input[name="${inputName}"]`).should("have.value", expectedValue);
  };
});
