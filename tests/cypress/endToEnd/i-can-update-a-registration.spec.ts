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
  iCanSeeTextInSummaryListRowWithHeading,
  iPerformOperationAndWaitForNewPageToLoad,
  theBackLinkContains,
  theBackLinkGoesTo,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickContinue,
  whenIClickTheActionLinkInATableRowContaining,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
  whenISelect,
} from "../common/selectors-and-assertions.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../common/when-i-go-to-delete-my.spec";
import { formatDateLong, formatMonth } from "../common/writing-style.spec";
import anotherBeaconRegistration from "../fixtures/anotherBeaconRegistration.json";
import singleBeaconRegistration from "../fixtures/singleBeaconRegistration.json";
import { iCanSeeMyExistingRegistrationMainUse } from "../common/i-can-see-my-existing-registration-main-use.spec";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(firstRegistrationToUpdate);
    andIHavePreviouslyRegisteredABeacon(secondRegistrationToUpdate);

    whenIHaveVisited("/account/your-beacon-registry-account");
    iCanSeeMyExistingRegistrationHexId(firstRegistrationToUpdate.hexId);
    iCanSeeMyExistingRegistrationMainUse(
      firstRegistrationToUpdate.uses[0].vesselName,
    );
    iCanClickTheUpdateLinkToUpdateARegistration(firstRegistrationToUpdate);

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
      firstRegistrationToUpdate.hexId,
    );
    iCanSeeTheDetailsOfMyRegistration(firstRegistrationToUpdate);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanUpdateTheDetailsOfMyExistingRegistration(firstRegistrationToUpdate);
    iCanSeeTheDetailsOfMyRegistration(firstUpdatedRegistration);

    iPerformOperationAndWaitForNewPageToLoad(() =>
      whenIClickTheButtonContaining("Accept and send"),
    );
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated",
    );

    whenIClickTheButtonContaining("Return to your Beacon Registry Account");
    thenTheUrlShouldContain("/account/your-beacon-registry-account");
    iCanSeeMyExistingRegistrationMainUse(
      firstRegistrationToUpdate.uses[0].vesselName,
    );

    whenIClickTheHexIdOfTheRegistrationIJustUpdated(
      firstRegistrationToUpdate.hexId,
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
      secondRegistrationToUpdate.hexId,
    );
    iCanSeeTheDetailsOfMyRegistration(secondRegistrationToUpdate);
    iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges();
    iCanUpdateTheDetailsOfMyExistingRegistration(secondRegistrationToUpdate);

    iPerformOperationAndWaitForNewPageToLoad(() =>
      whenIClickTheButtonContaining("Accept and send"),
    );
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated",
    );

    whenIClickTheButtonContaining("Return to your Beacon Registry Account");
    thenTheUrlShouldContain("/account/your-beacon-registry-account");
  });

  it("I can change the beacon owner's address from UK to international", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(firstRegistrationToUpdate);

    whenIHaveVisited("/account/your-beacon-registry-account");
    iCanSeeMyExistingRegistrationHexId(firstRegistrationToUpdate.hexId);

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
      firstRegistrationToUpdate.hexId,
    );

    whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
    theBackLinkContains("manage-my-registrations", "update");
    whenISelect("#restOfWorld");
    whenIClickContinue();
    iEditTheBeaconOwnersRestOfWorldAddress(
      "Beacon Towers",
      "Epirb wharf",
      "c/o Harbour Master",
      "Something",
      "60605",
      "United Arab Emirates",
    );
    whenIClickContinue();

    iCanSeeTextInSummaryListRowWithHeading("Beacon Towers", "Address");
    iCanSeeTextInSummaryListRowWithHeading("Epirb wharf", "Address");
    iCanSeeTextInSummaryListRowWithHeading("c/o Harbour Master", "Address");
    iCanSeeTextInSummaryListRowWithHeading("60605", "Address");
    iCanSeeTextInSummaryListRowWithHeading("United Arab Emirates", "Address");
    iCannotSeeTextInSummaryListRowWithHeading("Portsmouth", "Address");
    iCannotSeeTextInSummaryListRowWithHeading("Hampshire", "Address");
  });

  it("I can change the beacon owner's address from international to UK", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(
      registrationWithInternationalAddressToUpdate,
    );

    whenIHaveVisited("/account/your-beacon-registry-account");
    iCanSeeMyExistingRegistrationHexId(internationalAddressHexId);

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(internationalAddressHexId);

    whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
    theBackLinkContains("manage-my-registrations", "update");
    whenISelect("#unitedKingdom");
    whenIClickContinue();
    iEditTheBeaconOwnersUnitedKingdomAddress(
      "mmsi Towers",
      "PLB Wharf",
      "Falmouth",
      "Cornwall",
      "TR10 8AB",
    );
    whenIClickContinue();

    iCanSeeTextInSummaryListRowWithHeading("mmsi Towers", "Address");
    iCanSeeTextInSummaryListRowWithHeading("PLB Wharf", "Address");
    iCanSeeTextInSummaryListRowWithHeading("Falmouth", "Address");
    iCanSeeTextInSummaryListRowWithHeading("Cornwall", "Address");
    iCanSeeTextInSummaryListRowWithHeading("TR10 8AB", "Address");
    iCanSeeTextInSummaryListRowWithHeading("United Kingdom", "Address");
    iCannotSeeTextInSummaryListRowWithHeading("Something", "Address");
    iCannotSeeTextInSummaryListRowWithHeading("c/o Harbour Master", "Address");
  });
});

const iCannotSeeAnAcceptAndSendButtonBecauseIHaveNotMadeAnyChanges = () => {
  cy.get(`[role=button]:contains(accept and send)`).should("not.exist");
};

export const iCanClickTheUpdateLinkToUpdateARegistration = (
  registration,
): void => {
  whenIClickTheActionLinkInATableRowContaining(registration.hexId, /update/i);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);
  theBackLinkGoesTo("/account/your-beacon-registry-account");
  whenIClickBack();
  thenTheUrlShouldContain("/account/your-beacon-registry-account");
};

const iCanViewTheUpdatedOwnerInformation = (draftRegistration) => {
  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
  );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  iCanEditAFieldContaining(draftRegistration.owner.fullName);
  iCanEditAFieldContaining(draftRegistration.owner.telephoneNumber);
  iCanEditAFieldContaining(draftRegistration.owner.alternativeTelephoneNumber);
  iCanEditAFieldContaining(draftRegistration.owner.email);

  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickOnTheHexIdOfTheRegistrationIUpdated(
    firstRegistrationToUpdate.hexId,
  );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  whenISelect("#unitedKingdom");
  whenIClickContinue();
  iCanEditAFieldContaining(draftRegistration.owner.addressLine1);
  iCanEditAFieldContaining(draftRegistration.owner.addressLine2);
  iCanEditAFieldContaining(draftRegistration.owner.townOrCity);
  iCanEditAFieldContaining(draftRegistration.owner.county);
  iCanEditAFieldContaining(draftRegistration.owner.postcode);
};

const iCanViewTheUpdatedEmergencyContactInformation = (draftRegistration) => {
  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 1");
  iCanEditAFieldContaining(draftRegistration.emergencyContacts[0].fullName);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[0].telephoneNumber,
  );
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[0].alternativeTelephoneNumber,
  );

  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 2");
  iCanEditAFieldContaining(draftRegistration.emergencyContacts[1].fullName);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[1].telephoneNumber,
  );
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[1].alternativeTelephoneNumber,
  );

  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
  );
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 3");
  iCanEditAFieldContaining(draftRegistration.emergencyContacts[2].fullName);
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[2].telephoneNumber,
  );
  iCanEditAFieldContaining(
    draftRegistration.emergencyContacts[2].alternativeTelephoneNumber,
  );
};

const iCanViewTheUpdatedUseInformation = (draftRegistration) => {
  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
  );
  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  iCanSeeUseInformation(draftRegistration);
};

const firstRegistrationHexId = randomUkEncodedHexId();

const firstRegistrationToUpdate = {
  ...singleBeaconRegistration,
  hexId: firstRegistrationHexId,
};

const internationalAddressHexId = randomUkEncodedHexId();

const registrationWithInternationalAddressToUpdate = {
  ...singleBeaconRegistration,
  hexId: internationalAddressHexId,
  owner: {
    fullName: "Austin Powers",
    email: "austin@powers.co.uk",
    addressLine1: "Beacon Towers",
    addressLine2: "Eprib Wharf",
    addressLine3: "c/o Harbour Master",
    addressLine4: "Something",
    townOrCity: "",
    county: "",
    country: "United Arab Emirates",
    postcode: "60605",
  },
};

const secondRegistrationHexId = randomUkEncodedHexId();

const secondRegistrationToUpdate = {
  ...anotherBeaconRegistration,
  hexId: secondRegistrationHexId,
};

const firstUpdatedRegistration = {
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
  ownerCountry: "United Kingdom",
  emergencyContact1FullName: "Dr Martha",
  emergencyContact1TelephoneNumber: "07123456780",
  emergencyContact1AlternativeTelephoneNumber: "07123456781",
  uses: [
    {
      environment: "MARITIME",
      purpose: "PLEASURE",
      activity: "MOTOR",
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

const iCanSeeTheDetailsOfMyRegistration = (registration) => {
  iCanSeeMyExistingRegistrationHexId(registration.hexId);
  const dateRegistered = formatDateLong(new Date().toDateString()); // Assume test user registered beacon on same day for ease)
  iCanSeeTheHistoryOfMyRegistration(dateRegistered, dateRegistered);
  iCanSeeMyBeaconInformation(registration);
  iCanSeeAdditionalBeaconInformation(registration);
  iCanSeeOwnerInformation(registration);
  iCanSeeEmergencyContactInformation(registration);
  iCanSeeUseInformation(registration);
};

const iCanUpdateTheDetailsOfMyExistingRegistration = (registration) => {
  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Beacon information");
  theBackLinkContains("manage-my-registrations", "update");
  iEditMyBeaconManufacturerAndModel(
    registration,
    firstUpdatedRegistration.manufacturer,
    firstUpdatedRegistration.model,
  );
  iCanSeeButICannotEditMyHexId(registration);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading(
    "Additional beacon information",
  );
  theBackLinkContains("manage-my-registrations", "update");
  iEditMyBeaconInformation(
    registration,
    firstUpdatedRegistration.manufacturerSerialNumber,
    firstUpdatedRegistration.chkCode,
    firstUpdatedRegistration.csta,
    firstUpdatedRegistration.batteryExpiryDateMonth,
    firstUpdatedRegistration.batteryExpiryDateYear,
    firstUpdatedRegistration.lastServicedDateMonth,
    firstUpdatedRegistration.lastServicedDateYear,
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  theBackLinkContains("manage-my-registrations", "update");
  whenIGoToDeleteMy(/first use/i);
  iAmPromptedToConfirm(
    registration.uses[0].environment,
    registration.uses[0].purpose,
    registration.uses[0].activity,
  );
  whenIClickTheButtonContaining("Yes");
  theNumberOfUsesIs(0);
  andIClickTheButtonContaining("Add a use");
  iCanSeeAPageHeadingThatContains("first use");
  theBackLinkContains("manage-my-registrations", "update", "use");
  givenIHaveEnteredMyMaritimeUse("PLEASURE");
  theNumberOfUsesIs(1);
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Owner details");
  theBackLinkContains("manage-my-registrations", "update");
  iEditMyOwnerInformation(
    registration,
    firstUpdatedRegistration.owner.fullName,
    firstUpdatedRegistration.owner.telephoneNumber,
    firstUpdatedRegistration.owner.alternativeTelephoneNumber,
    firstUpdatedRegistration.owner.email,
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Address");
  theBackLinkContains("manage-my-registrations", "update");
  whenISelect("#unitedKingdom");
  whenIClickContinue();
  iEditTheBeaconOwnersUnitedKingdomAddress(
    firstUpdatedRegistration.owner.addressLine1,
    firstUpdatedRegistration.owner.addressLine2,
    firstUpdatedRegistration.owner.townOrCity,
    firstUpdatedRegistration.owner.county,
    firstUpdatedRegistration.owner.postcode,
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 1");
  theBackLinkContains("manage-my-registrations", "update");
  iEditMyEmergencyContactInformation(
    registration,
    firstUpdatedRegistration.emergencyContact1FullName,
    firstUpdatedRegistration.emergencyContact1TelephoneNumber,
    firstUpdatedRegistration.emergencyContact1AlternativeTelephoneNumber,
  );
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 2");
  theBackLinkContains("manage-my-registrations", "update");
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading("Contact 3");
  theBackLinkContains("manage-my-registrations", "update");
  whenIClickContinue();
  thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);
};

const iCanSeeTheHistoryOfMyRegistration = (
  dateRegistered: string,
  dateUpdated: string,
) => {
  cy.get(".govuk-summary-list__value")
    .should("contain", "First registered")
    .and("contain", dateRegistered);

  cy.get(".govuk-summary-list__value")
    .should("contain", "Last updated")
    .and("contain", dateUpdated);
};

const iCanSeeMyBeaconInformation = (registration) => {
  cy.get("main").contains(registration.manufacturer);
  cy.get("main").contains(registration.model);
  cy.get("main").contains(registration.hexId);
};

const iCanSeeAdditionalBeaconInformation = (registration) => {
  cy.get("main").contains(registration.manufacturerSerialNumber);
  cy.get("main").contains(formatMonth(registration.batteryExpiryDate));
  cy.get("main").contains(formatMonth(registration.lastServicedDate));
};

const iCanSeeOwnerInformation = (registration) => {
  cy.get("main").contains(registration.owner.fullName);
  cy.get("main").contains(registration.owner.telephoneNumber);
  cy.get("main").contains(registration.owner.alternativeTelephoneNumber);
  cy.get("main").contains(registration.owner.email);
  cy.get("main").contains(registration.owner.addressLine1);
  if (registration.owner.addressLine2) {
    cy.get("main").contains(registration.owner.addressLine2);
  }
  if (registration.owner.addressLine3) {
    cy.get("main").contains(registration.owner.addressLine3);
  }
  if (registration.owner.addressLine4) {
    cy.get("main").contains(registration.owner.addressLine4);
  }
  cy.get("main").contains(registration.owner.townOrCity);
  cy.get("main").contains(registration.owner.postcode);
  cy.get("main").contains(registration.owner.country);
};

const iCanSeeEmergencyContactInformation = (registration) => {
  registration.emergencyContacts.forEach((emergencyContact) => {
    cy.get("main").contains(emergencyContact.fullName);
    cy.get("main").contains(emergencyContact.telephoneNumber);
    if (emergencyContact.alternativeTelephoneNumber) {
      cy.get("main").contains(emergencyContact.alternativeTelephoneNumber);
    }
  });
};

const iCanSeeUseInformation = (draftRegistration) => {
  draftRegistration.uses.forEach((use) => {
    cy.get("main").contains(new RegExp(use.environment, "i"));
    cy.get("main").contains(new RegExp(use.activity, "i"));
    if (use.environment !== "LAND") {
      cy.get("main").contains(new RegExp(use.purpose, "i"));
    }

    cy.get("main").contains("About this use");
    cy.get("main").contains("Communications");
    cy.get("main").contains("More details");
  });
};

const whenIClickTheChangeLinkForTheSummaryListRowWithHeading = (
  heading: string,
) => {
  cy.get("dt")
    .contains(heading)
    .parent()
    .contains(/change/i)
    .click();
};

const iCannotSeeTextInSummaryListRowWithHeading = (
  text: string,
  heading: string,
) => {
  cy.get("dt").contains(heading).parent().should("not.contain", text);
};

const whenIClickTheChangeLinkForTheSectionWithHeading = (heading: string) => {
  cy.get("h2")
    .contains(heading)
    .parent()
    .contains(/change/i)
    .click();
};

export const iEditMyBeaconManufacturerAndModel = (
  registration,
  newManufacturer: string,
  newModel: string,
): void => {
  cy.get(`input[value="${registration.manufacturer}"]`)
    .clear()
    .type(newManufacturer);
  cy.get(`input[value="${registration.model}"]`).clear().type(newModel);
};

export const iCanSeeButICannotEditMyHexId = (registration): void => {
  cy.get("main").contains(registration.hexId);
};

export const iEditMyBeaconInformation = (
  registration,
  newManufacturerSerialNumber: string,
  newChkCode: string,
  csta: string,
  newBatteryExpiryDateMonth: string,
  newBatteryExpiryDateYear: string,
  newLastServicedDateMonth: string,
  newLastServicedDateYear: string,
): void => {
  cy.get('input[name="manufacturerSerialNumber"]')
    .clear()
    .type(newManufacturerSerialNumber);
  cy.get('input[name="chkCode"]').clear().type(newChkCode);
  cy.get('input[name="batteryExpiryDateMonth"]')
    .clear()
    .type(newBatteryExpiryDateMonth);
  cy.get('input[name="batteryExpiryDateYear"]')
    .clear()
    .type(newBatteryExpiryDateYear);
  cy.get('input[name="lastServicedDateMonth"]')
    .clear()
    .type(newLastServicedDateMonth);
  cy.get('input[name="lastServicedDateYear"]')
    .clear()
    .type(newLastServicedDateYear);
};

const iEditMyOwnerInformation = (
  registration,
  newFullName,
  newTelephoneNumber,
  newAlternativeTelephoneNumber,
  newEmail,
) => {
  cy.get(`input[value="${registration.owner.fullName}"]`)
    .clear()
    .type(newFullName);
  cy.get(`input[value="${registration.owner.telephoneNumber}"]`)
    .clear()
    .type(newTelephoneNumber);
  cy.get(`input[value="${registration.owner.alternativeTelephoneNumber}"]`)
    .clear()
    .type(newAlternativeTelephoneNumber);
  cy.get(`input[value="${registration.owner.email}"]`).clear().type(newEmail);
};

const iEditTheBeaconOwnersUnitedKingdomAddress = (
  newAddressLine1,
  newAddressLine2,
  newTownOrCity,
  newCounty,
  newPostcode,
) => {
  cy.get("#ownerAddressLine1").clear().type(newAddressLine1);
  cy.get("#ownerAddressLine2").clear().type(newAddressLine2);
  cy.get("#ownerTownOrCity").clear().type(newTownOrCity);
  cy.get("#ownerCounty").clear().type(newCounty);
  cy.get("#ownerPostcode").clear().type(newPostcode);
};

const iEditTheBeaconOwnersRestOfWorldAddress = (
  newAddressLine1,
  newAddressLine2,
  newAddressLine3,
  newAddressLine4,
  newPostcode,
  newCountry,
) => {
  cy.get("#ownerAddressLine1").clear().type(newAddressLine1);
  cy.get("#ownerAddressLine2").clear().type(newAddressLine2);
  cy.get("#ownerAddressLine3").clear().type(newAddressLine3);
  cy.get("#ownerAddressLine4").clear().type(newAddressLine4);
  cy.get("#ownerPostcode").clear().type(newPostcode);
  cy.get("#ownerCountry").select(newCountry);
};

const iEditMyEmergencyContactInformation = (
  registration,
  newEmergencyContactName,
  newEmergencyContactTelephoneNumber,
  newEmergencyContactAlternativeTelephoneNumber,
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

const iCanViewTheUpdatedBeaconInformation = (updatedRegistrationDetails) => {
  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
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
  updatedRegistrationDetails,
) => {
  whenIHaveVisited("/account/your-beacon-registry-account");
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate(
    firstRegistrationToUpdate.hexId,
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
          updatedRegistrationDetails.batteryExpiryDateMonth,
      ),
    )
    .and(
      "contain",
      formatMonth(
        updatedRegistrationDetails.lastServicedDateYear +
          "-" +
          updatedRegistrationDetails.lastServicedDateMonth,
      ),
    );

  whenIClickTheChangeLinkForTheSummaryListRowWithHeading(
    "Additional beacon information",
  );
  iCanSeeAPageHeadingThatContains("Beacon information");
};

export const thenIShouldBeOnTheRegistrationSummaryPageForHexId = (hexId) => {
  iCanSeeAPageHeadingThatContains("Your registered beacon with Hex ID/UIN");
  iCanSeeAPageHeadingThatContains(hexId);
};
