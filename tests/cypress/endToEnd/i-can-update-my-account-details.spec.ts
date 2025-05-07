import {
  andIClickContinue,
  givenIHaveSignedIn,
  givenIHaveVisited,
  iCannotSeeText,
  iCanSeeAPageHeadingThatContains,
  iCanSeeText,
  requiredFieldErrorMessage,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  thenTheDropdownShouldHaveTheFirstOptionSelected,
  thenTheInputShouldBeEmpty,
  thenTheUrlShouldContain,
  whenIClearAndType,
  whenIClearTheInput,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenISelect,
  whenISelectTheOptionFromTheDropdown,
  whenITypeInAnEmptyField,
} from "../common/selectors-and-assertions.spec";

describe("As an AccountHolder", () => {
  const fullNameSelector = "#fullName";
  const telephoneSelector = "#telephoneNumber";
  const addressSelector = "#addressLine1";
  const townOrCitySelector = "#townOrCity";
  const countySelector = "#county";
  const postcodeSelector = "#postcode";

  const whenIClickContinue = () => {
    cy.contains("Save these account details").click();
  };

  describe("who now lives in the United Kingdom", () => {
    it("I can change my address to one in the United Kingdom", () => {
      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#unitedKingdom");
      andIClickContinue();

      whenIClearAndType("Mrs Beacon", fullNameSelector);
      whenIClearAndType("+447713812659", telephoneSelector);
      whenIClearAndType("100 Beacons Road", addressSelector);
      whenIClearAndType("Beaconshire", countySelector);
      whenIClearAndType("Beacons", townOrCitySelector);
      whenIClearAndType("BS8 9DB", postcodeSelector);

      whenIClickContinue();
      thenTheUrlShouldContain("/account/your-beacon-registry-account");
    });

    it("I am reminded to enter mandatory fields for a United Kingdom-based address", () => {
      const expectations = [
        {
          errorMessages: ["Full name", requiredFieldErrorMessage],
          selector: fullNameSelector,
        },
        {
          errorMessages: ["Telephone number", requiredFieldErrorMessage],
          selector: telephoneSelector,
        },
        {
          errorMessages: [
            "Address line one (building number and street name)",
            requiredFieldErrorMessage,
          ],
          selector: addressSelector,
        },
        {
          errorMessages: ["Town or city", requiredFieldErrorMessage],
          selector: townOrCitySelector,
        },
        {
          errorMessages: ["Postcode", requiredFieldErrorMessage],
          selector: postcodeSelector,
        },
      ];

      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#unitedKingdom");
      andIClickContinue();

      whenIClearTheInput(fullNameSelector);
      whenIClearTheInput(telephoneSelector);
      whenIClickContinue();

      expectations.forEach((expectation) => {
        thenIShouldSeeFormErrors(...expectation.errorMessages);
        whenIClickOnTheErrorSummaryLinkContaining(...expectation.errorMessages);
        thenMyFocusMovesTo(expectation.selector);
      });
    });

    it("I am reminded to enter a valid telephone number", () => {
      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");
      whenISelect("#unitedKingdom");
      andIClickContinue();

      const tooLongMobileNumber = "+44 71234567891";
      const expectedErrorMessage = ["telephone number", "like"];
      whenIClearAndType(tooLongMobileNumber, telephoneSelector);
      whenIClickContinue();

      thenIShouldSeeFormErrors(...expectedErrorMessage);
    });

    it("I previously lived outside of the United Kingdom", () => {
      // Set up to live outside of the United Kingdom
      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      whenISelect("#restOfWorld");
      andIClickContinue();
      whenIClearAndType("Monsieur Beacon", fullNameSelector);
      whenIClearAndType("Mrs Beacon", fullNameSelector);
      whenIClearAndType("+447713812659", telephoneSelector);
      whenIClearAndType("Swanson Wharf", "#addressLine1");
      whenIClearAndType("Royal Dubai Yacht Club", "#addressLine2");
      whenIClearAndType("Desert", "#addressLine3");
      whenIClearAndType("Earth", "#addressLine4");
      whenISelectTheOptionFromTheDropdown("United Arab Emirates", "#country");
      whenIClearAndType("60605", postcodeSelector);

      // Update to live in the United Kingdom
      givenIHaveVisited("/account/update-account");
      whenISelect("#unitedKingdom");
      andIClickContinue();
      thenTheInputShouldBeEmpty(addressSelector);
      thenTheInputShouldBeEmpty("#addressLine2");
      thenTheInputShouldBeEmpty(townOrCitySelector);
      thenTheInputShouldBeEmpty(countySelector);
      thenTheInputShouldBeEmpty(postcodeSelector);

      whenITypeInAnEmptyField("100 Beacon Road", addressSelector);
      whenITypeInAnEmptyField("Beaconshire", countySelector);
      whenITypeInAnEmptyField("Beaconsville", townOrCitySelector);
      whenITypeInAnEmptyField("BS8 9DB", postcodeSelector);

      whenIClickContinue();
      thenTheUrlShouldContain("/account/your-beacon-registry-account");

      iCanSeeText("100 Beacon Road");
      iCanSeeText("Beaconshire");
      iCanSeeText("Beaconsville");
      iCanSeeText("BS8 9DB");
      iCanSeeText("United Kingdom");
      iCannotSeeText("Desert");
      iCannotSeeText("Earth");
    });
  });

  describe("who now lives somewhere other than the United Kingdom", () => {
    it("I can change my address to one outside the United Kingdom", () => {
      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#restOfWorld");
      andIClickContinue();

      whenIClearAndType("Mrs Beacon", fullNameSelector);
      whenIClearAndType("+447713812659", telephoneSelector);
      whenIClearAndType("Swanson Wharf", "#addressLine1");
      whenIClearAndType("Royal Dubai Yacht Club", "#addressLine2");
      whenIClearAndType("Desert", "#addressLine3");
      whenIClearAndType("Earth", "#addressLine4");
      whenISelectTheOptionFromTheDropdown("United Arab Emirates", "#country");
      whenIClearAndType("60605", postcodeSelector);

      whenIClickContinue();
      thenTheUrlShouldContain("/account/your-beacon-registry-account");

      iCanSeeText("Swanson Wharf");
      iCanSeeText("Royal Dubai Yacht Club");
      iCanSeeText("Desert");
      iCanSeeText("Earth");
      iCanSeeText("United Arab Emirates");
      iCanSeeText("60605");
    });

    it("I previously lived in the United Kingdom", () => {
      // Set up to live in the United Kingdom
      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      whenISelect("#unitedKingdom");
      andIClickContinue();
      whenIClearAndType("Mrs Beacon", fullNameSelector);
      whenIClearAndType("+447713812659", telephoneSelector);
      whenIClearAndType("100 Beacons Road", addressSelector);
      whenIClearAndType("Beaconshire", countySelector);
      whenIClearAndType("Beaconsville", townOrCitySelector);
      whenIClearAndType("BS8 9DB", postcodeSelector);
      whenIClickContinue();

      // Update to live outside of the United Kingdom
      givenIHaveVisited("/account/update-account");
      whenISelect("#restOfWorld");
      andIClickContinue();

      thenTheInputShouldBeEmpty("#addressLine1");
      thenTheInputShouldBeEmpty("#addressLine2");
      thenTheInputShouldBeEmpty("#addressLine3");
      thenTheInputShouldBeEmpty("#addressLine4");
      thenTheDropdownShouldHaveTheFirstOptionSelected("#country");
      thenTheInputShouldBeEmpty("#postcode");

      whenITypeInAnEmptyField("Swanson Wharf", "#addressLine1");
      whenITypeInAnEmptyField("Royal Dubai Yacht Club", "#addressLine2");
      // TODO: Update to dropdown
      whenISelectTheOptionFromTheDropdown("United Arab Emirates", "#country");
      whenITypeInAnEmptyField("60605", postcodeSelector);

      whenIClickContinue();
      thenTheUrlShouldContain("/account/your-beacon-registry-account");
      iCanSeeText("Swanson Wharf");
      iCanSeeText("Royal Dubai Yacht Club");
      iCanSeeText("United Arab Emirates");
      iCanSeeText("60605");
      iCanSeeText("United Arab Emirates");
      iCannotSeeText("Beaconsville");
      iCannotSeeText("Beaconshire");
    });

    it("I am reminded to enter mandatory fields for a 'restOfWorld' address", () => {
      const expectations = [
        {
          errorMessages: ["Enter your full name"],
          selector: fullNameSelector,
        },
        {
          errorMessages: ["Enter your telephone number"],
          selector: telephoneSelector,
        },
        {
          errorMessages: ["Enter the first line of your address"],
          selector: "#addressLine1",
        },
        {
          errorMessages: ["Enter the second line of your address"],
          selector: "#addressLine2",
        },
        {
          errorMessages: ["Select your country"],
          selector: "#country",
        },
      ];

      givenIHaveSignedIn();
      givenIHaveVisited("/account/update-account");
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#restOfWorld");
      andIClickContinue();

      whenIClearTheInput(fullNameSelector);
      whenIClearTheInput(telephoneSelector);
      whenIClickContinue();

      expectations.forEach((expectation) => {
        thenIShouldSeeFormErrors(...expectation.errorMessages);
        whenIClickOnTheErrorSummaryLinkContaining(...expectation.errorMessages);
        thenMyFocusMovesTo(expectation.selector);
      });
    });
  });
});
