import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";
import {
  givenIHaveClickedContinue,
  givenIHaveSelected,
  givenIHaveTypedInAnEmptyField,
  whenIClearAndType,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyPersonalDetails = (): void => {
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerDetails.fullName,
    "#ownerFullName"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerDetails.telephoneNumber,
    "#ownerTelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerDetails.alternativeTelephoneNumber,
    "#ownerAlternativeTelephoneNumber"
  );
  whenIClearAndType(testBeaconAndOwnerData.ownerDetails.email, "#ownerEmail");
  givenIHaveClickedContinue();
};

export const givenIHaveSelectedAUnitedKingdomAddress = (): void => {
  givenIHaveSelected("#unitedKingdom");
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyUnitedKingdomAddressDetails = (): void => {
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerAddress.addressLine1,
    "#ownerAddressLine1"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerAddress.addressLine2,
    "#ownerAddressLine2"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerAddress.townOrCity,
    "#ownerTownOrCity"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.ownerAddress.postcode,
    "#ownerPostcode"
  );
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyEmergencyContactDetails = (): void => {
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact1FullName,
    "#emergencyContact1FullName"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact1TelephoneNumber,
    "#emergencyContact1TelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact1AlternativeTelephoneNumber,
    "#emergencyContact1AlternativeTelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact2FullName,
    "#emergencyContact2FullName"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact2TelephoneNumber,
    "#emergencyContact2TelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact2AlternativeTelephoneNumber,
    "#emergencyContact2AlternativeTelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact3FullName,
    "#emergencyContact3FullName"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact3TelephoneNumber,
    "#emergencyContact3TelephoneNumber"
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact3AlternativeTelephoneNumber,
    "#emergencyContact3AlternativeTelephoneNumber"
  );
  givenIHaveClickedContinue();
};

export const iCanSeeMyEmergencyContactDetails = (): void =>
  Object.values(testBeaconAndOwnerData.emergencyContacts).forEach((value) =>
    cy.get("main").contains(value)
  );
