import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Registration } from "../../src/entities/Registration";
import {
  Activity,
  Environment,
  Purpose,
} from "../../src/lib/deprecatedRegistration/types";
import { AccountPageURLs } from "../../src/lib/urls";
import { Actions } from "../../src/lib/URLs/Actions";
import { Resources } from "../../src/lib/URLs/Resources";
import { formatDateLong, formatMonth } from "../../src/lib/writingStyle";
import { iAmPromptedToConfirm } from "../common/i-am-prompted-to-confirm.spec";
import { givenIHaveEnteredMyMaritimeUse } from "../common/i-can-enter-use-information/maritime.spec";
import { iCanSeeMyExistingRegistrationHexId } from "../common/i-can-see-my-existing-registration-hex-id.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickContinue,
  andIClickTheButtonContaining,
  givenIHaveSignedIn,
  iCanEditAFieldContaining,
  iCanSeeAPageHeadingThatContains,
  iPerformOperationAndWaitForNewPageToLoad,
  theBackLinkContains,
  theBackLinkGoesTo,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickContinue,
  whenIClickTheActionLinkInATableRowContaining,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../common/when-i-go-to-delete-my.spec";
import { anotherBeaconRegistration } from "../fixtures/anotherBeaconRegistration";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(firstRegistrationToUpdate);
    andIHavePreviouslyRegisteredABeacon(secondRegistrationToUpdate);

    whenIHaveVisited(AccountPageURLs.accountHome);
    iCanSeeMyExistingRegistrationHexId(firstRegistrationToUpdate.hexId);
    iCanClickTheUpdateLinkToUpdateARegistration(firstRegistrationToUpdate);

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
      firstRegistrationToUpdate.hexId
    );
    iCanSeeTheDetailsOfMyRegistration(firstRegistrationToUpdate);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanUpdateTheDetailsOfMyExistingRegistration(firstRegistrationToUpdate);
    iCanSeeTheDetailsOfMyRegistration(firstUpdatedRegistration as Registration);

    iPerformOperationAndWaitForNewPageToLoad(() =>
      whenIClickTheButtonContaining("Accept and send")
    );
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated"
    );

    whenIClickTheButtonContaining("Return to your Account");
    thenTheUrlShouldContain(AccountPageURLs.accountHome);

    whenIClickTheHexIdOfTheRegistrationIJustUpdated(
      firstRegistrationToUpdate.hexId
    );
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanViewTheUpdatedBeaconInformation(firstUpdatedRegistration);
    iCanViewTheUpdatedAdditionalBeaconInformation(firstUpdatedRegistration);
    iCanViewTheUpdatedUseInformation(firstUpdatedRegistration);
    iCanViewTheUpdatedOwnerInformation(firstUpdatedRegistration);
    iCanViewTheUpdatedEmergencyContactInformation(firstUpdatedRegistration);
    andIClickContinue();

    whenIClickBack();
    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
      secondRegistrationToUpdate.hexId
    );
    iCanSeeTheDetailsOfMyRegistration(secondRegistrationToUpdate);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanUpdateTheDetailsOfMyExistingRegistration(secondRegistrationToUpdate);

    iPerformOperationAndWaitForNewPageToLoad(() =>
      whenIClickTheButtonContaining("Accept and send")
    );
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated"
    );

    whenIClickTheButtonContaining("Return to your Account");
    thenTheUrlShouldContain(AccountPageURLs.accountHome);
  });
});

const iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges = () => {
  cy.get(`[role=button]:contains(accept and send)`).should("not.exist");
};

export const iCanClickTheUpdateLinkToUpdateARegistration = (
  registration: Registration
): void => {
  whenIClickTheActionLinkInATableRowContaining(registration.hexId, /update/i);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);
  theBackLinkGoesTo(AccountPageURLs.accountHome);
  whenIClickBack();
  thenTheUrlShouldContain(AccountPageURLs.accountHome);
};

const iCanViewTheUpdatedOwnerInformation = (
  draftRegistration: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  iCanEditAFieldContaining(draftRegistration.ownerFullName);
  iCanEditAFieldContaining(draftRegistration.ownerTelephoneNumber);
  iCanEditAFieldContaining(draftRegistration.ownerAlternativeTelephoneNumber);
  iCanEditAFieldContaining(draftRegistration.ownerEmail);

  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickOnTheHexIdOfTheRegistrationIUpdated(
    firstRegistrationToUpdate.hexId
  );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  iCanEditAFieldContaining(draftRegistration.ownerAddressLine1);
  iCanEditAFieldContaining(draftRegistration.ownerAddressLine2);
  iCanEditAFieldContaining(draftRegistration.ownerTownOrCity);
  iCanEditAFieldContaining(draftRegistration.ownerCounty);
  iCanEditAFieldContaining(draftRegistration.ownerPostcode);
};

const iCanViewTheUpdatedEmergencyContactInformation = (
  draftRegistration: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 1");
  iCanEditAFieldContaining(draftRegistration.emergencyContact1FullName);
  iCanEditAFieldContaining(draftRegistration.emergencyContact1TelephoneNumber);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContact1AlternativeTelephoneNumber
  );

  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 2");
  iCanEditAFieldContaining(draftRegistration.emergencyContact2FullName);
  iCanEditAFieldContaining(draftRegistration.emergencyContact2TelephoneNumber);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContact2AlternativeTelephoneNumber
  );

  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 3");
  iCanEditAFieldContaining(draftRegistration.emergencyContact3FullName);
  iCanEditAFieldContaining(draftRegistration.emergencyContact3TelephoneNumber);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContact3AlternativeTelephoneNumber
  );
};

const iCanViewTheUpdatedUseInformation = (
  draftRegistration: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );
  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  iCanSeeUseInformation(draftRegistration);
};

const firstRegistrationHexId = randomUkEncodedHexId();

const firstRegistrationToUpdate: Registration = {
  ...singleBeaconRegistration,
  hexId: firstRegistrationHexId,
};

const secondRegistrationHexId = randomUkEncodedHexId();

const secondRegistrationToUpdate: Registration = {
  ...anotherBeaconRegistration,
  hexId: secondRegistrationHexId,
};

const firstUpdatedRegistration: DraftRegistration = {
  ...firstRegistrationToUpdate,
  manufacturer: "McMurdo",
  model: "New Beacon",
  manufacturerSerialNumber: "New SerialNumber",
  chkCode: "New Chk code",
  csta: "CSTA",
  batteryExpiryDateMonth: "01",
  batteryExpiryDateYear: "2050",
  batteryExpiryDate: "2050-01-01",
  lastServicedDateMonth: "12",
  lastServicedDateYear: "2020",
  lastServicedDate: "2020-12-01",
  ownerFullName: "John Johnnsonn",
  ownerTelephoneNumber: "0711111111",
  ownerAlternativeTelephoneNumber: "02012345678",
  ownerEmail: "hello@hello.com",
  ownerAddressLine1: "1 Street",
  ownerAddressLine2: "Area",
  ownerTownOrCity: "Town",
  ownerCounty: "County",
  ownerPostcode: "AB1 2CD",
  emergencyContact1FullName: "Dr Martha",
  emergencyContact1TelephoneNumber: "07123456780",
  emergencyContact1AlternativeTelephoneNumber: "07123456781",
  uses: [
    {
      environment: Environment.MARITIME,
      purpose: Purpose.PLEASURE,
      activity: Activity.MOTOR,
    },
  ],
};

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};

const whenIClickTheHexIdOfTheRegistrationIJustUpdated =
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate;

const whenIClickOnTheHexIdOfTheRegistrationIUpdated =
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate;

const iCanSeeTheDetailsOfMyRegistration = (registration: Registration) => {
  iCanSeeMyExistingRegistrationHexId(registration.hexId);
  const dateRegistered = formatDateLong(new Date().toDateString()); // Assume test user registered beacon on same day for ease)
  iCanSeeTheHistoryOfMyRegistration(dateRegistered, dateRegistered);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);
};

const iCanUpdateTheDetailsOfMyExistingRegistration = (
  registration: Registration
) => {
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Beacon information");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyBeaconManufacturerAndModel(
    registration,
    firstUpdatedRegistration.manufacturer,
    firstUpdatedRegistration.model
  );
  iCanSeeButICannotEditMyHexId(registration);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading(
    "Additional beacon information"
  );
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyBeaconInformation(
    registration,
    firstUpdatedRegistration.manufacturerSerialNumber,
    firstUpdatedRegistration.chkCode,
    firstUpdatedRegistration.csta,
    firstUpdatedRegistration.batteryExpiryDateMonth,
    firstUpdatedRegistration.batteryExpiryDateYear,
    firstUpdatedRegistration.lastServicedDateMonth,
    firstUpdatedRegistration.lastServicedDateYear
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  theBackLinkContains(Resources.registration, Actions.update);
  whenIGoToDeleteMy(/main use/i);
  iAmPromptedToConfirm(
    registration.uses[0].environment,
    registration.uses[0].purpose,
    registration.uses[0].activity
  );
  whenIClickTheButtonContaining("Yes");
  theNumberOfUsesIs(0);
  andIClickTheButtonContaining("Add a use");
  iCanSeeAPageHeadingThatContains("main use");
  theBackLinkContains(Resources.registration, Actions.update, Resources.use);
  givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
  theNumberOfUsesIs(1);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyOwnerInformation(
    registration,
    firstUpdatedRegistration.ownerFullName,
    firstUpdatedRegistration.ownerTelephoneNumber,
    firstUpdatedRegistration.ownerAlternativeTelephoneNumber,
    firstUpdatedRegistration.ownerEmail
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyOwnerAddress(
    registration,
    firstUpdatedRegistration.ownerAddressLine1,
    firstUpdatedRegistration.ownerAddressLine2,
    firstUpdatedRegistration.ownerTownOrCity,
    firstUpdatedRegistration.ownerCounty,
    firstUpdatedRegistration.ownerPostcode
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 1");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyEmergencyContactInformation(
    registration,
    firstUpdatedRegistration.emergencyContact1FullName,
    firstUpdatedRegistration.emergencyContact1TelephoneNumber,
    firstUpdatedRegistration.emergencyContact1AlternativeTelephoneNumber
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 2");
  theBackLinkContains(Resources.registration, Actions.update);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 3");
  theBackLinkContains(Resources.registration, Actions.update);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);
};

const iCanSeeTheHistoryOfMyRegistration = (
  dateRegistered: string,
  dateUpdated: string
) => {
  cy.get(".govuk-summary-list__value")
    .should("contain", "First registered")
    .and("contain", dateRegistered);

  cy.get(".govuk-summary-list__value")
    .should("contain", "Last updated")
    .and("contain", dateUpdated);
};

const iCanSeeMyBeaconInformation = (registration: Registration) => {
  cy.get("main").contains(registration.manufacturer);
  cy.get("main").contains(registration.model);
  cy.get("main").contains(registration.hexId);
};

const iCanSeeAdditionalBeaconInformation = (registration: Registration) => {
  cy.get("main").contains(registration.manufacturerSerialNumber);
  cy.get("main").contains(formatMonth(registration.batteryExpiryDate));
  cy.get("main").contains(formatMonth(registration.lastServicedDate));
};

const iCanSeeOwnerInformation = (registration: Registration) => {
  cy.get("main").contains(registration.ownerFullName);
  cy.get("main").contains(registration.ownerTelephoneNumber);
  cy.get("main").contains(registration.ownerAlternativeTelephoneNumber);
  cy.get("main").contains(registration.ownerEmail);
  cy.get("main").contains(registration.ownerAddressLine1);
  if (registration.ownerAddressLine2) {
    cy.get("main").contains(registration.ownerAddressLine2);
  }
  cy.get("main").contains(registration.ownerTownOrCity);
  cy.get("main").contains(registration.ownerPostcode);
};

const iCanSeeEmergencyContactInformation = (registration: Registration) => {
  cy.get("main").contains(registration.emergencyContact1FullName);
  cy.get("main").contains(registration.emergencyContact1TelephoneNumber);
  if (registration.emergencyContact1AlternativeTelephoneNumber) {
    cy.get("main").contains(
      registration.emergencyContact1AlternativeTelephoneNumber
    );
  }
  cy.get("main").contains(registration.emergencyContact2FullName);
  cy.get("main").contains(registration.emergencyContact2TelephoneNumber);
  if (registration.emergencyContact2AlternativeTelephoneNumber) {
    cy.get("main").contains(
      registration.emergencyContact2AlternativeTelephoneNumber
    );
  }
  cy.get("main").contains(registration.emergencyContact3FullName);
  cy.get("main").contains(registration.emergencyContact3TelephoneNumber);
  if (registration.emergencyContact3AlternativeTelephoneNumber) {
    cy.get("main").contains(
      registration.emergencyContact3AlternativeTelephoneNumber
    );
  }
};

const iCanSeeUseInformation = (draftRegistration: DraftRegistration) => {
  draftRegistration.uses.forEach((use) => {
    cy.get("main").contains(new RegExp(use.environment, "i"));
    cy.get("main").contains(new RegExp(use.activity, "i"));
    if (use.environment !== Environment.LAND) {
      cy.get("main").contains(new RegExp(use.purpose, "i"));
    }

    cy.get("main").contains("About this use");
    cy.get("main").contains("Communications");
    cy.get("main").contains("More details");
  });
};

const whenIClickTheChangeLinkForTheSummaryListRowWithHeading = (
  heading: string
) => {
  cy.get("dt")
    .contains(heading)
    .parent()
    .contains(/change/i)
    .click();
};

const whenIClickTheChangeLinkForTheSectionWithHeading = (heading: string) => {
  cy.get("h2")
    .contains(heading)
    .parent()
    .contains(/change/i)
    .click();
};

export const iEditMyBeaconManufacturerAndModel = (
  registration: Registration,
  newManufacturer: string,
  newModel: string
): void => {
  cy.get(`input[value="${registration.manufacturer}"]`)
    .clear()
    .type(newManufacturer);
  cy.get(`input[value="${registration.model}"]`).clear().type(newModel);
};

export const iCanSeeButICannotEditMyHexId = (
  registration: Registration
): void => {
  cy.get("main").contains(registration.hexId);
};

export const iEditMyBeaconInformation = (
  registration: Registration,
  newManufacturerSerialNumber: string,
  newChkCode: string,
  csta: string,
  newBatteryExpiryDateMonth: string,
  newBatteryExpiryDateYear: string,
  newLastServicedDateMonth: string,
  newLastServicedDateYear: string
): void => {
  cy.get(`input[value="${registration.manufacturerSerialNumber}"]`)
    .clear()
    .type(newManufacturerSerialNumber);
  cy.get(`input[value="${registration.chkCode}"]`).clear().type(newChkCode);
  cy.get(`input[value="${registration.batteryExpiryDateMonth}"]`)
    .clear()
    .type(newBatteryExpiryDateMonth);
  cy.get(`input[value="${registration.batteryExpiryDateYear}"]`)
    .clear()
    .type(newBatteryExpiryDateYear);
  cy.get(`input[value="${registration.lastServicedDateMonth}"]`)
    .clear()
    .type(newLastServicedDateMonth);
  cy.get(`input[value="${registration.lastServicedDateYear}"]`)
    .clear()
    .type(newLastServicedDateYear);
};

const iEditMyOwnerInformation = (
  registration,
  newFullName,
  newTelephoneNumber,
  newAlternativeTelephoneNumber,
  newEmail
) => {
  cy.get(`input[value="${registration.ownerFullName}"]`)
    .clear()
    .type(newFullName);
  cy.get(`input[value="${registration.ownerTelephoneNumber}"]`)
    .clear()
    .type(newTelephoneNumber);
  cy.get(`input[value="${registration.ownerAlternativeTelephoneNumber}"]`)
    .clear()
    .type(newAlternativeTelephoneNumber);
  cy.get(`input[value="${registration.ownerEmail}"]`).clear().type(newEmail);
};

const iEditMyOwnerAddress = (
  registration,
  newAddressLine1,
  newAddressLine2,
  newTownOrCity,
  newCounty,
  newPostcode
) => {
  cy.get(`input[value="${registration.ownerAddressLine1}"]`)
    .clear()
    .type(newAddressLine1);
  cy.get(`input[value="${registration.ownerAddressLine2}"]`)
    .clear()
    .type(newAddressLine2);
  cy.get(`input[value="${registration.ownerTownOrCity}"]`)
    .clear()
    .type(newTownOrCity);
  cy.get(`input[value="${registration.ownerCounty}"]`).clear().type(newCounty);
  cy.get(`input[value="${registration.ownerPostcode}"]`)
    .clear()
    .type(newPostcode);
};

const iEditMyEmergencyContactInformation = (
  registration: Registration,
  newEmergencyContactName,
  newEmergencyContactTelephoneNumber,
  newEmergencyContactAlternativeTelephoneNumber
) => {
  cy.get("#emergencyContact1FullName")
    .clear()
    .type(`${newEmergencyContactName}`);
  cy.get("#emergencyContact1TelephoneNumber")
    .clear()
    .type(`${newEmergencyContactTelephoneNumber}`);
  cy.get("#emergencyContact1AlternativeTelephoneNumber")
    .clear()
    .type(`${newEmergencyContactAlternativeTelephoneNumber}`);
};

const iCanViewTheUpdatedBeaconInformation = (
  updatedRegistrationDetails: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );

  cy.get("dt")
    .contains("Beacon information")
    .parent()
    .contains(updatedRegistrationDetails.manufacturer)
    .and("contain", updatedRegistrationDetails.model);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Beacon information");
  iCanSeeAPageHeadingThatContains("Beacon details");
};

const iCanViewTheUpdatedAdditionalBeaconInformation = (
  updatedRegistrationDetails: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId
  );

  cy.get("dt")
    .contains("Additional beacon information")
    .parent()
    .contains(updatedRegistrationDetails.manufacturerSerialNumber)
    .and("contain", updatedRegistrationDetails.chkCode)
    .and(
      "contain",
      formatMonth(
        updatedRegistrationDetails.batteryExpiryDateYear +
          "-" +
          updatedRegistrationDetails.batteryExpiryDateMonth
      )
    )
    .and(
      "contain",
      formatMonth(
        updatedRegistrationDetails.lastServicedDateYear +
          "-" +
          updatedRegistrationDetails.lastServicedDateMonth
      )
    );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading(
    "Additional beacon information"
  );
  iCanSeeAPageHeadingThatContains("Beacon information");
};

const thenIShouldBeOnTheRegistrationSummaryPageForHexId = (hexId) => {
  iCanSeeAPageHeadingThatContains("Your registered beacon with Hex ID/UIN");
  iCanSeeAPageHeadingThatContains(hexId);
};
