import { PageURLs } from "../../src/lib/urls";
import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";
import {
  andIClickContinue,
  andIHaveSelected,
  givenIAmAt,
  givenIHaveBeenTo,
  givenIHaveClicked,
  givenIHaveClickedContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  thenTheUrlShouldContain,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyBeaconDetails = (): void => {
  givenIHaveFilledInCheckBeaconDetailsPage();
  givenIHaveFilledInBeaconInformationPage();
};

export const givenIHaveFilledInCheckBeaconDetailsPage = (): void => {
  givenIHaveBeenTo(PageURLs.start);
  givenIHaveClicked(".govuk-button--start");
  givenIHaveTyped(
    testBeaconAndOwnerData.beaconDetails.manufacturer,
    "#manufacturer"
  );
  givenIHaveTyped(testBeaconAndOwnerData.beaconDetails.model, "#model");
  givenIHaveTyped(testBeaconAndOwnerData.beaconDetails.hexId, "#hexId");
  givenIHaveClickedContinue();
};

export const givenIHaveFilledInBeaconInformationPage = (): void => {
  const beaconInfo = testBeaconAndOwnerData.additionalBeaconInformation;
  thenTheUrlShouldContain(PageURLs.beaconInformation);
  givenIHaveTyped(beaconInfo.serialNumber, "#manufacturerSerialNumber");
  givenIHaveTyped(beaconInfo.chkCode, "#chkCode");
  givenIHaveTyped(beaconInfo.batteryExpiryMonth, "#batteryExpiryDateMonth");
  givenIHaveTyped(beaconInfo.batteryExpiryYear, "#batteryExpiryDateYear");
  givenIHaveTyped(beaconInfo.lastServicedMonth, "#lastServicedDateMonth");
  givenIHaveTyped(beaconInfo.lastServicedYear, "#lastServicedDateYear");
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyPersonalDetails = (): void => {
  givenIAmAt(PageURLs.aboutBeaconOwner);
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerDetails.fullName,
    "#ownerFullName"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerDetails.telephoneNumber,
    "#ownerTelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerDetails.alternativeTelephoneNumber,
    "#ownerAlternativeTelephoneNumber"
  );
  givenIHaveTyped(testBeaconAndOwnerData.ownerDetails.email, "#ownerEmail");
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyAddressDetails = (): void => {
  givenIAmAt(PageURLs.beaconOwnerAddress);
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerAddress.addressLine1,
    "#ownerAddressLine1"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerAddress.addressLine2,
    "#ownerAddressLine2"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerAddress.townOrCity,
    "#ownerTownOrCity"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.ownerAddress.postcode,
    "#ownerPostcode"
  );
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyEmergencyContactDetails = (): void => {
  givenIAmAt(PageURLs.emergencyContact);
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact1FullName,
    "#emergencyContact1FullName"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact1TelephoneNumber,
    "#emergencyContact1TelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact1AlternativeTelephoneNumber,
    "#emergencyContact1AlternativeTelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact2FullName,
    "#emergencyContact2FullName"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact2TelephoneNumber,
    "#emergencyContact2TelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact2AlternativeTelephoneNumber,
    "#emergencyContact2AlternativeTelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact3FullName,
    "#emergencyContact3FullName"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts.emergencyContact3TelephoneNumber,
    "#emergencyContact3TelephoneNumber"
  );
  givenIHaveTyped(
    testBeaconAndOwnerData.emergencyContacts
      .emergencyContact3AlternativeTelephoneNumber,
    "#emergencyContact3AlternativeTelephoneNumber"
  );
  givenIHaveClickedContinue();
};

export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain(PageURLs.additionalUse);
  givenIHaveSelected("#no");
  andIClickContinue();
};

export const asAMaritimeBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#maritime");
  andIClickContinue();
};

export const asAnAviationBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#aviation");
  andIClickContinue();
};

export const asAMaritimePleasureBeaconOwner = (): void => {
  asAMaritimeBeaconOwner();
  andIHaveSelected("#pleasure");
  andIClickContinue();
};
