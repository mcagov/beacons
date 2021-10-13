import { AccountPageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveSignedIn,
  givenIHaveVisited,
  iCanSeeAPageHeadingThatContains,
  requiredFieldErrorMessage,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClearAndType,
  whenIClearTheInput,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenISelect,
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
      givenIHaveVisited(AccountPageURLs.updateAccount);
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
      thenTheUrlShouldContain(AccountPageURLs.accountHome);
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
      givenIHaveVisited(AccountPageURLs.updateAccount);
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#unitedKingdom");
      andIClickContinue();

      whenIClearTheInput(fullNameSelector);
      whenIClearTheInput(telephoneSelector);
      whenIClearTheInput(addressSelector);
      whenIClearTheInput(townOrCitySelector);
      whenIClearTheInput(postcodeSelector);
      whenIClickContinue();

      expectations.forEach((expectation) => {
        thenIShouldSeeFormErrors(...expectation.errorMessages);
        whenIClickOnTheErrorSummaryLinkContaining(...expectation.errorMessages);
        thenMyFocusMovesTo(expectation.selector);
      });
    });

    it("I am reminded to enter a valid telephone number", () => {
      givenIHaveSignedIn();
      givenIHaveVisited(AccountPageURLs.updateAccount);
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");
      whenISelect("#unitedKingdom");
      andIClickContinue();

      const tooLongMobileNumber = "+44 71234567891";
      const expectedErrorMessage = ["telephone number", "like"];
      whenIClearAndType(tooLongMobileNumber, telephoneSelector);
      whenIClickContinue();

      thenIShouldSeeFormErrors(...expectedErrorMessage);
    });
  });

  describe("who now lives somewhere other than the United Kingdom", () => {
    it.only("I can change my address to one outside the United Kingdom", () => {
      givenIHaveSignedIn();
      givenIHaveVisited(AccountPageURLs.updateAccount);
      iCanSeeAPageHeadingThatContains("Do you live in the United Kingdom?");

      whenISelect("#restOfWorld");
      andIClickContinue();

      whenIClearAndType("Mrs Beacon", fullNameSelector);
      whenIClearAndType("+447713812659", telephoneSelector);
      whenIClearAndType("Swanson Wharf", "#addressLine1");
      whenIClearAndType("Royal Dubai Yacht Club", "#addressLine2");
      whenIClearAndType("United Arab Emirates", "#country");
      whenIClearAndType("60605", postcodeSelector);

      whenIClickContinue();
      thenTheUrlShouldContain(AccountPageURLs.accountHome);
    });
  });
});
