import { AccountPageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveSignedIn,
  givenIHaveVisited,
  iCanSeeText,
  requiredFieldErrorMessage,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClearAndType,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenISelect,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As an AccountHolder", () => {
  const fullNameSelector = "#fullName";
  const telephoneSelector = "#telephoneNumber";
  const addressSelector = "#addressLine1";
  const townOrCitySelector = "#townOrCity";
  const countySelector = "#county";
  const postcodeSelector = "#postcode";

  it.only("I can change my address to an address in the United Kingdom", () => {
    givenIHaveSignedIn();
    givenIHaveVisited(AccountPageURLs.updateAccount);

    iCanSeeText("Do you live in the United Kingdom?");
    whenISelect("#yes");
    andIClickContinue();

    whenIClearAndType("Mrs Beacon", fullNameSelector);
    whenIClearAndType("+447713812659", telephoneSelector);
    whenIClearAndType("100 Beacons Road", addressSelector);
    whenIClearAndType("Beacons", townOrCitySelector);
    whenIClearAndType("BS8 9DB", postcodeSelector);

    whenIClickContinue();
    thenTheUrlShouldContain(AccountPageURLs.accountHome);
  });

  it("requires mandatory fields", () => {
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

    whenIClickContinue();

    expectations.forEach((expectation) => {
      thenIShouldSeeFormErrors(...expectation.errorMessages);
      whenIClickOnTheErrorSummaryLinkContaining(...expectation.errorMessages);
      thenMyFocusMovesTo(expectation.selector);
    });
  });

  it("requires the telephone number to be valid", () => {
    const tooLongMobileNumber = "+44 71234567891";
    const expectedErrorMessage = ["telephone number", "like"];

    whenIType(tooLongMobileNumber, telephoneSelector);
    whenIClickContinue();

    thenIShouldSeeFormErrors(...expectedErrorMessage);
  });
});

const whenIClickContinue = () => {
  cy.contains("Save these account details").click();
};
