import { PageURLs } from "../../../src/lib/urls";
import { testAccountDetails } from "./happy-path-test-data.spec";
import {
  givenIHaveClickedTheButtonContaining,
  thenTheUrlShouldContain,
  whenIClearAndType,
  whenIClearTheInput,
} from "./selectors-and-assertions.spec";

export const givenIHaveFilledInUpdateAccountDetailsPage = (): void => {
  whenIClearAndType(testAccountDetails.fullName, "#fullName");
  whenIClearAndType(testAccountDetails.telephoneNumber, "#telephoneNumber");
  whenIClearAndType(testAccountDetails.addressLine1, "#addressLine1");
  whenIClearTheInput("#addressLine2");
  whenIClearAndType(testAccountDetails.townOrCity, "#townOrCity");
  whenIClearTheInput("#county");
  whenIClearAndType(testAccountDetails.postcode, "#postcode");
  givenIHaveClickedTheButtonContaining("Save these account details");
};

export const iCanSeeMyAccountDetails = (): void => {
  thenTheUrlShouldContain(PageURLs.accountHome);
  cy.contains(testAccountDetails.fullName);
  cy.contains(testAccountDetails.telephoneNumber);
  cy.contains(testAccountDetails.addressLine1);
  cy.contains(testAccountDetails.townOrCity);
  cy.contains(testAccountDetails.postcode);
};
