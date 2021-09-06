import { CreateRegistrationPageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("Given I have submitted invalid data to a registration form,", () => {
  describe("when I refresh the page,", () => {
    it("I can still see my invalid data", () => {
      givenIHaveSignedIn();
      givenIHaveACookieSetAndIVisit(
        CreateRegistrationPageURLs.checkBeaconDetails
      );
      whenIType("ACME Inc.", "#manufacturer");
      whenIType("Excelsior", "#model");
      whenIType("invalid hex id", "#hexId");
      andIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains("HEX ID");
      thenIShouldSeeAnErrorMessageThatContains("HEX ID");

      givenIHaveRefreshedThePage();

      iCanEditAFieldContaining("ACME Inc.");
      iCanEditAFieldContaining("Excelsior");
      iCanEditAFieldContaining("INVALID HEX ID");
    });
  });
});

const givenIHaveRefreshedThePage = () => cy.reload();

const iCanEditAFieldContaining = (value: string): void => {
  cy.get(`input[value="${value}"]`);
};
