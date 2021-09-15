import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Registration } from "../../src/entities/Registration";
import {
  Activity,
  Environment,
  Purpose,
} from "../../src/lib/deprecatedRegistration/types";
import { AccountPageURLs, UpdatePageURLs } from "../../src/lib/urls";
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
  andIClickTheButtonContaining,
  givenIHaveSignedIn,
  iCanEditAFieldContaining,
  iCanSeeAPageHeadingThatContains,
  theBackLinkContains,
  theBackLinkGoesTo,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickContinue,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../common/when-i-go-to-delete-my.spec";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIHaveVisited(AccountPageURLs.accountHome);
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);
    iCanClickTheUpdateLinkToUpdateARegistration(testRegistration);

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanUpdateTheDetailsOfMyExistingRegistration(testRegistration);

    whenIClickTheButtonContaining("Accept and send");
    thenTheUrlShouldContain(UpdatePageURLs.updateComplete);
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated"
    );

    whenIClickTheButtonContaining("Return to your Account");
    thenTheUrlShouldContain(AccountPageURLs.accountHome);

    whenIClickTheHexIdOfTheRegistrationIJustUpdated(testRegistration.hexId);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanViewTheUpdatedBeaconInformation(updatedRegistrationDetails);
    iCanViewTheUpdatedAdditionalBeaconInformation(updatedRegistrationDetails);
    iCanViewTheUpdatedUseInformation(updatedRegistrationDetails);
    iCanViewTheUpdatedOwnerInformation(updatedRegistrationDetails);
  });
});

const iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges = () => {
  cy.get(`[role=button]:contains(accept and send)`).should("not.exist");
};

const iCanClickTheUpdateLinkToUpdateARegistration = (
  registration: Registration
) => {
  cy.get("main")
    .contains(registration.hexId)
    .parent()
    .parent()
    .contains(/update/i)
    .click();

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
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  thenTheUrlShouldContain(UpdatePageURLs.aboutBeaconOwner);
  iCanEditAFieldContaining(draftRegistration.ownerFullName);
  iCanEditAFieldContaining(draftRegistration.ownerTelephoneNumber);
  iCanEditAFieldContaining(draftRegistration.ownerAlternativeTelephoneNumber);
  iCanEditAFieldContaining(draftRegistration.ownerEmail);

  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickOnTheHexIdOfTheRegistrationIUpdated(testRegistration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  thenTheUrlShouldContain(UpdatePageURLs.beaconOwnerAddress);
  iCanEditAFieldContaining(draftRegistration.ownerAddressLine1);
  iCanEditAFieldContaining(draftRegistration.ownerAddressLine2);
  iCanEditAFieldContaining(draftRegistration.ownerTownOrCity);
  iCanEditAFieldContaining(draftRegistration.ownerCounty);
  iCanEditAFieldContaining(draftRegistration.ownerPostcode);
};

const iCanViewTheUpdatedUseInformation = (
  draftRegistration: DraftRegistration
) => {
  whenIHaveVisited(AccountPageURLs.accountHome);
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
  whenIClickTheChangeLinkForTheSectionWithHeading("Main use");
  thenTheUrlShouldContain(UpdatePageURLs.usesSummary);
  iCanSeeUseInformation(draftRegistration);
};

const testRegistration: Registration = {
  ...singleBeaconRegistration,
  hexId: randomUkEncodedHexId(),
};

const updatedRegistrationDetails: DraftRegistration = {
  manufacturer: "McMurdo",
  model: "New Beacon",
  manufacturerSerialNumber: "New SerialNumber",
  chkCode: "New Chk code",
  batteryExpiryDateMonth: "01",
  batteryExpiryDateYear: "2050",
  lastServicedDateMonth: "12",
  lastServicedDateYear: "2020",
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

const iCanUpdateTheDetailsOfMyExistingRegistration = (
  registration: Registration
) => {
  iCanSeeMyExistingRegistrationHexId(registration.hexId);
  const dateRegistered = formatDateLong(new Date().toDateString()); // Assume test user registered beacon on same day for ease)
  iCanSeeTheHistoryOfMyRegistration(dateRegistered, dateRegistered);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Beacon information");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyBeaconManufacturerAndModel(
    registration,
    updatedRegistrationDetails.manufacturer,
    updatedRegistrationDetails.model
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
    updatedRegistrationDetails.manufacturerSerialNumber,
    updatedRegistrationDetails.chkCode,
    updatedRegistrationDetails.batteryExpiryDateMonth,
    updatedRegistrationDetails.batteryExpiryDateYear,
    updatedRegistrationDetails.lastServicedDateMonth,
    updatedRegistrationDetails.lastServicedDateYear
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSectionWithHeading("Main use");
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
  givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
  theNumberOfUsesIs(1);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyOwnerInformation(
    registration,
    updatedRegistrationDetails.ownerFullName,
    updatedRegistrationDetails.ownerTelephoneNumber,
    updatedRegistrationDetails.ownerAlternativeTelephoneNumber,
    updatedRegistrationDetails.ownerEmail
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyOwnerAddress(
    registration,
    updatedRegistrationDetails.ownerAddressLine1,
    updatedRegistrationDetails.ownerAddressLine2,
    updatedRegistrationDetails.ownerTownOrCity,
    updatedRegistrationDetails.ownerCounty,
    updatedRegistrationDetails.ownerPostcode
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 1");
  theBackLinkContains(Resources.registration, Actions.update);
  iEditMyEmergencyContactInformation(
    registration,
    updatedRegistrationDetails.emergencyContact1FullName,
    updatedRegistrationDetails.emergencyContact1TelephoneNumber,
    updatedRegistrationDetails.emergencyContact1AlternativeTelephoneNumber
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
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);

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
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);

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
