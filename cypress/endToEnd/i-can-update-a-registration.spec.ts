import { Registration } from "../../src/entities/Registration";
import { Environment } from "../../src/lib/deprecatedRegistration/types";
import { AccountPageURLs, UpdatePageURLs } from "../../src/lib/urls";
import { formatDateLong, formatMonth } from "../../src/lib/writingStyle";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveSignedIn,
  theBackLinkGoesTo,
  thenTheUrlShouldContain,
  whenIAmAt,
  whenIClickContinue,
} from "../integration/common/selectors-and-assertions.spec";
import { iCanSeeMyExistingRegistrationHexId } from "./common/i-can-see-my-existing-registration-hex-id.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIAmAt(AccountPageURLs.accountHome);
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

    whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
    iCanUpdateTheDetailsOfMyExistingRegistration(testRegistration);
  });
});

const testRegistration: Registration = {
  ...singleBeaconRegistration,
  hexId: randomUkEncodedHexId(),
};

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};

const iCanUpdateTheDetailsOfMyExistingRegistration = (
  registration: Registration
) => {
  iCanSeeMyExistingRegistrationHexId(registration.hexId);
  const dateRegistered = formatDateLong(new Date().toDateString()); // Assume test user registered beacon on same day for ease)
  const dateUpdated = dateRegistered; // Assume test user registered beacon on same day for ease)
  iCanSeeTheHistoryOfMyRegistration(dateRegistered, dateUpdated);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);

  whenIClickTheUpdateButtonForTheSectionWithHeading("Beacon information");
  thenTheUrlShouldContain(UpdatePageURLs.beaconDetails);
  theBackLinkGoesTo(UpdatePageURLs.registrationSummary);

  iEditMyBeaconManufacturerAndModel(registration, "McMurdo", "New Beacon");
  iCanSeeButICannotEditMyHexId(registration);
  whenIClickContinue();

  thenTheUrlShouldContain(UpdatePageURLs.beaconInformation);
  iEditMyBeaconInformation(
    registration,
    "New SerialNumber",
    "New Chk code",
    "01",
    "2050",
    "12",
    "2020"
  );
  // whenIClickContinue();

  thenTheUrlShouldContain(UpdatePageURLs.environment);
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

const iCanSeeUseInformation = (registration: Registration) => {
  registration.uses.forEach((use) => {
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

const whenIClickTheUpdateButtonForTheSectionWithHeading = (heading: string) => {
  cy.get("dt")
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
