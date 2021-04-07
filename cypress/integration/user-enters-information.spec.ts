import { PageURLs } from "../../src/lib/urls";
import { testAviationPleasureUse, testData } from "./happy-path-test-data.spec";
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
  givenIHaveBeenTo(PageURLs.start);
  givenIHaveClicked(".govuk-button--start");
  givenIHaveTyped(testData.beaconDetails.manufacturer, "#manufacturer");
  givenIHaveTyped(testData.beaconDetails.model, "#model");
  givenIHaveTyped(testData.beaconDetails.hexId, "#hexId");
  givenIHaveClickedContinue();
  thenTheUrlShouldContain(PageURLs.beaconInformation);
  givenIHaveTyped(
    testData.additionalBeaconInformation.serialNumber,
    "#manufacturerSerialNumber"
  );
  givenIHaveTyped(testData.additionalBeaconInformation.chkCode, "#chkCode");
  givenIHaveTyped(
    testData.additionalBeaconInformation.batteryExpiryMonth,
    "#batteryExpiryDateMonth"
  );
  givenIHaveTyped(
    testData.additionalBeaconInformation.batteryExpiryYear,
    "#batteryExpiryDateYear"
  );
  givenIHaveTyped(
    testData.additionalBeaconInformation.lastServicedMonth,
    "#lastServicedDateMonth"
  );
  givenIHaveTyped(
    testData.additionalBeaconInformation.lastServicedYear,
    "#lastServicedDateYear"
  );
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyPersonalDetails = (): void => {
  givenIAmAt(PageURLs.aboutBeaconOwner);
  givenIHaveTyped(testData.ownerDetails.fullName, "#ownerFullName");
  givenIHaveTyped(
    testData.ownerDetails.telephoneNumber,
    "#ownerTelephoneNumber"
  );
  givenIHaveTyped(
    testData.ownerDetails.alternativeTelephoneNumber,
    "#ownerAlternativeTelephoneNumber"
  );
  givenIHaveTyped(testData.ownerDetails.email, "#ownerEmail");
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyAddressDetails = (): void => {
  givenIAmAt(PageURLs.beaconOwnerAddress);
  givenIHaveTyped(testData.ownerAddress.addressLine1, "#ownerAddressLine1");
  givenIHaveTyped(testData.ownerAddress.addressLine2, "#ownerAddressLine2");
  givenIHaveTyped(testData.ownerAddress.townOrCity, "#ownerTownOrCity");
  givenIHaveTyped(testData.ownerAddress.postcode, "#ownerPostcode");
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredMyEmergencyContactDetails = (): void => {
  givenIAmAt(PageURLs.emergencyContact);
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact1FullName,
    "#emergencyContact1FullName"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact1TelephoneNumber,
    "#emergencyContact1TelephoneNumber"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact1AlternativeTelephoneNumber,
    "#emergencyContact1AlternativeTelephoneNumber"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact2FullName,
    "#emergencyContact2FullName"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact2TelephoneNumber,
    "#emergencyContact2TelephoneNumber"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact2AlternativeTelephoneNumber,
    "#emergencyContact2AlternativeTelephoneNumber"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact3FullName,
    "#emergencyContact3FullName"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact3TelephoneNumber,
    "#emergencyContact3TelephoneNumber"
  );
  givenIHaveTyped(
    testData.emergencyContacts.emergencyContact3AlternativeTelephoneNumber,
    "#emergencyContact3AlternativeTelephoneNumber"
  );
  givenIHaveClickedContinue();
};

export const givenIHaveEnteredInformationAboutMyAircraft = (): void => {
  givenIAmAt(PageURLs.aboutTheAircraft);
  givenIHaveTyped(testAviationPleasureUse.maxCapacity, "#maxCapacity");
  givenIHaveTyped(
    testAviationPleasureUse.manufacturer,
    "#aircraftManufacturer"
  );
  givenIHaveTyped(
    testAviationPleasureUse.principalAirport,
    "#principalAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUse.secondaryAirport,
    "#secondaryAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUse.registrationMark,
    "#registrationMark"
  );
  givenIHaveTyped(testAviationPleasureUse.hexAddress, "#hexAddress");
  givenIHaveTyped(testAviationPleasureUse.cnOrMsnNumber, "#cnOrMsnNumber");
  givenIHaveSelected("#dongle-yes");
  givenIHaveTyped(testAviationPleasureUse.beaconPosition, "#beaconPosition");
};

export const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
  givenIAmAt(PageURLs.aircraftCommunications);
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(
    testAviationPleasureUse.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(
    testAviationPleasureUse.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTyped(
    testAviationPleasureUse.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(
    testAviationPleasureUse.otherCommunication,
    "#otherCommunicationInput"
  );
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
