describe("As a beacon owner, I want to submit information about my beacon", () => {
  const pageLocation = "/register-a-beacon/beacon-information";

  beforeEach(() => {
    givenIAmOnTheBeaconInformationPage();
  });

  it("displays errors if no manufacturer serial number is submitted", () => {
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Beacon manufacturer is a required field");
  });

  it("displays errors if the battery expiry date is invalid", () => {
    whenIType("beacon", "batteryExpiryDateMonth");
    whenIType("beacon", "batteryExpiryDateYear");
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Enter a complete battery expiry date");
  });

  it("displays errors if the battery expiry date is a valid date but before 1980", () => {
    whenIType("01", "batteryExpiryDateMonth");
    whenIType("1979", "batteryExpiryDateYear");
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Battery expiry date must be after 1980");
  });

  it("displays errors if the last serviced date is invalid", () => {
    whenIType("beacon", "lastServicedDateMonth");
    whenIType("beacon", "lastServicedDateYear");
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Enter a complete last serviced date");
  });

  it("displays errors if the last serviced date is a valid date but before 1980", () => {
    whenIType("01", "lastServicedDateMonth");
    whenIType("1979", "lastServicedDateYear");
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Last serviced date must be after 1980");
  });

  it("displays errors if the last serviced date in the future", () => {
    const date = new Date();
    const futureYear = date.getFullYear() + 1;
    whenIType(`${date.getMonth()}`, "lastServicedDateMonth");
    whenIType(`${futureYear}`, "lastServicedDateYear");
    whenIClickContinue();

    thenISeeAnErrorWithMessage("Enter a last serviced date in the past");
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

  const thenISeeAnErrorWithMessage = (errorMessage: string) => {
    cy.get("a").should("contain", errorMessage);
  };
});
