import { PageURLs } from "../../src/lib/urls";
import {
  givenIHaveACookieSetAndHaveSignedInIVisit,
  givenIHaveClearedTheInput,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../integration/common/selectors-and-assertions.spec";
import { requiredFieldErrorMessage } from "./../integration/common/selectors-and-assertions.spec";

describe("As an account holder", () => {
  const fullNameSelector = "#fullName";
  const telephoneSelector = "#telephoneNumber";
  const addressSelector = "#addressLine1";
  const townOrCitySelector = "#townOrCity";
  const countySelector = "#county";
  const postcodeSelector = "#postcode";

  const whenIClickContinue = () => {
    cy.contains("Save these account details").click();
  };

  const givenIHaveClearedAllInputFields = () => {
    [
      fullNameSelector,
      telephoneSelector,
      addressSelector,
      townOrCitySelector,
      countySelector,
      postcodeSelector,
    ].forEach((input) => givenIHaveClearedTheInput(input));
  };

  beforeEach(() => {
    givenIHaveACookieSetAndHaveSignedInIVisit(PageURLs.updateAccount);
    givenIHaveClearedAllInputFields();
  });

  it("should allow the user to update their information", () => {
    whenIType("Mrs Beacon", fullNameSelector);
    whenIType("+447713812659", telephoneSelector);
    whenIType("100 Beacons Road", addressSelector);
    whenIType("Beacons", townOrCitySelector);
    whenIType("BS8 9DB", postcodeSelector);

    whenIClickContinue();
    thenTheUrlShouldContain(PageURLs.accountHome);
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
        errorMessages: ["Building number", requiredFieldErrorMessage],
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
