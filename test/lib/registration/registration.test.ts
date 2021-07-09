import { Registration } from "../../../src/lib/registration/registration";
import {
  initBeacon,
  initBeaconUse,
} from "../../../src/lib/registration/registrationInitialisation";
import { IUseRequestBody } from "../../../src/lib/registration/registrationRequestBody";
import {
  Activity,
  BeaconUse,
  Environment,
  Purpose,
} from "../../../src/lib/registration/types";
import {
  getMockBeacon,
  getMockEmergencyContact,
  getMockOwner,
  getMockUse,
} from "../../mocks";

describe("Registration", () => {
  let registration: Registration;

  beforeEach(() => {
    registration = new Registration();
  });

  describe("updating beacon information", () => {
    it("should handle null form data", () => {
      registration.update(null);

      expect(registration.registration).toStrictEqual(initBeacon());
    });

    it("should handle undefined form data", () => {
      registration.update(undefined);

      expect(registration.registration).toStrictEqual(initBeacon());
    });

    it("should update the values from the form data", () => {
      const formData = { hexId: "Hex" };
      registration.update(formData);

      expect(registration.registration.hexId).toBe("Hex");
    });

    it("should not update the registration with fields that are not valid keys for a beacon registration", () => {
      const formData = {
        hexId: "Hex",
        foo: "bar",
      };
      registration.update(formData);

      expect(registration.registration["foo"]).toBeUndefined();
    });

    it("should not overwrite the beacon uses array", () => {
      const formData = { uses: "Is not an array" } as any;
      registration.update(formData);

      expect(registration.registration.uses).toBeInstanceOf(Array);
    });
  });

  describe("creating beacon uses", () => {
    it("should create an additional beacon use", () => {
      registration.createUse();
      expect(registration.registration.uses.length).toBe(2);
    });

    it("should not alter the existing beacon use", () => {
      const formData = { environment: Environment.MARITIME };
      registration.update(formData);
      registration.createUse();

      expect(registration.registration.uses[0].environment).toBe(
        Environment.MARITIME
      );
    });
  });

  describe("updating beacon uses", () => {
    it("should update a beacon use with the values provided at the given index", () => {
      const formData = { useIndex: 0, environment: Environment.MARITIME };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(1);
      expect(registration.registration.uses[0].environment).toBe(
        Environment.MARITIME
      );
    });

    it("should update the first beacon use if no index is provided and there are two beacon uses", () => {
      registration.registration.uses.push(initBeaconUse());
      const formData = { environment: Environment.MARITIME };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(2);
      expect(registration.registration.uses[0].environment).toBe(
        Environment.MARITIME
      );
    });

    it("should update the latest beacon use if the index is greater than the length of the beacon use array", () => {
      const formData = {
        useIndex: 100,
        environment: Environment.MARITIME,
      };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(1);
      expect(registration.registration.uses[0].environment).toBe(
        Environment.MARITIME
      );
    });
  });

  describe("flattening the registration object", () => {
    it("should flatten the registration and return the first use if no index is provided", () => {
      const formData = { environment: Environment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: null }).environment
      ).toBe(Environment.MARITIME);
    });

    it("should flatten the registration and return use objects as top level keys", () => {
      const formData = { useIndex: 0, environment: Environment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: 0 }).environment
      ).toBe(Environment.MARITIME);
    });

    it("should return the latest beacon use information if the index is greater than the length of the array", () => {
      registration.registration.uses.push(initBeaconUse());
      const formData = { useIndex: 1, environment: Environment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: 100 }).environment
      ).toBe(Environment.MARITIME);
    });

    it("should remove the uses key from the flattened object", () => {
      expect(
        registration.getFlattenedRegistration({ useIndex: 0 }).uses
      ).toBeUndefined();
    });
  });

  describe("serialising the registration for the API", () => {
    let beacon;
    let use: BeaconUse;
    let owner;
    let emergencyContact;
    let formData;

    beforeEach(() => {
      beacon = getMockBeacon();
      use = getMockUse();
      owner = getMockOwner();
      emergencyContact = getMockEmergencyContact();

      formData = {
        ...beacon,
        ...use,
        fixedVhfRadioInput: use.fixedVhfRadioInput,
        portableVhfRadioInput: use.portableVhfRadioInput,
        otherCommunicationInput: use.otherCommunicationInput,
        satelliteTelephoneInput: use.satelliteTelephoneInput,
        mobileTelephoneInput1: use.mobileTelephoneInput1,
        mobileTelephoneInput2: use.mobileTelephoneInput2,
        otherActivityText: use.otherActivityText,
        ownerFullName: owner.fullName,
        ownerEmail: owner.email,
        ownerTelephoneNumber: owner.telephoneNumber,
        ownerAlternativeTelephoneNumber: owner.alternativeTelephoneNumber,
        ownerAddressLine1: owner.addressLine1,
        ownerAddressLine2: owner.addressLine2,
        ownerTownOrCity: owner.townOrCity,
        ownerCounty: owner.county,
        ownerPostcode: owner.postcode,
        emergencyContact1FullName: emergencyContact.fullName,
        emergencyContact1TelephoneNumber: emergencyContact.telephoneNumber,
        emergencyContact1AlternativeTelephoneNumber:
          emergencyContact.alternativeTelephoneNumber,
        emergencyContact2FullName: emergencyContact.fullName,
        emergencyContact2TelephoneNumber: emergencyContact.telephoneNumber,
        emergencyContact2AlternativeTelephoneNumber:
          emergencyContact.alternativeTelephoneNumber,
        emergencyContact3FullName: emergencyContact.fullName,
        emergencyContact3TelephoneNumber: emergencyContact.telephoneNumber,
        emergencyContact3AlternativeTelephoneNumber:
          emergencyContact.alternativeTelephoneNumber,
      };

      registration.update(formData);
    });

    it("should serialise the registration for sending to the API", () => {
      const expectedUseRequestBody: IUseRequestBody = {
        activity: Activity.OTHER,
        aircraftManufacturer: "Boeing",
        areaOfOperation: "Newport",
        beaconLocation: "In my carry bag",
        beaconPosition: "Carry bag",
        callSign: "callSign",
        cnOrMsnNumber: "123456",
        dongle: false,
        environment: Environment.MARITIME,
        fixedVhfRadio: true,
        fixedVhfRadioValue: "0117",
        hexAddress: "123456",
        homeport: "Bristol",
        imoNumber: "123456",
        mainUse: true,
        mobileTelephone: true,
        mobileTelephone1: "01178123456",
        mobileTelephone2: "01178123457",
        moreDetails: "Blue boat, tracked in SafeTrx",
        officialNumber: "123456",
        otherActivity: "On my boat",
        otherActivityLocation: "Taunton",
        otherActivityPeopleCount: "10",
        otherCommunication: true,
        otherCommunicationValue: "Via email",
        portLetterNumber: "12345",
        portableVhfRadio: true,
        portableVhfRadioValue: "0118",
        principalAirport: "Bristol",
        purpose: Purpose.PLEASURE,
        registrationMark: "Reg mark",
        rigPlatformLocation: "On the rig",
        rssNumber: "123456",
        satelliteTelephone: true,
        satelliteTelephoneValue: "0119",
        secondaryAirport: "Cardiff",
        ssrNumber: "123456",
        vesselName: "My lucky boat",
        vhfRadio: false,
        windfarmLocation: "10",
        windfarmPeopleCount: "10",
        workingRemotelyLocation: "Bristol",
        workingRemotelyPeopleCount: "10",
      };
      const expected = {
        beacons: [
          {
            ...beacon,
            uses: [expectedUseRequestBody],
            owner: { ...owner },
            emergencyContacts: [
              emergencyContact,
              emergencyContact,
              emergencyContact,
            ],
          },
        ],
      };

      const json = registration.serialiseToAPI();

      expect(json).toMatchObject(expected);
      expect(json.beacons[0].uses.length).toBe(1);
      expect(json.beacons[0].emergencyContacts.length).toBe(3);
    });

    it("should serialise a second use", () => {
      registration.createUse();
      registration.update({ useIndex: 1, ...formData });
      const json = registration.serialiseToAPI();

      expect(json.beacons[0].uses.length).toBe(2);
    });

    it("should serialise the purpose if it is defined", () => {
      registration.update({ purpose: Purpose.PLEASURE });
      use.purpose = Purpose.PLEASURE;
      const json = registration.serialiseToAPI();

      expect(json.beacons[0].uses[0].purpose).toBe(Purpose.PLEASURE);
    });

    it("should not serialise the other activity text, location or people count if other activity is not selected", () => {
      registration.update({ activity: Activity.CARGO_AIRPLANE });
      const json = registration.serialiseToAPI();

      expect(json.beacons[0].uses[0].otherActivity).toBe("");
      expect(json.beacons[0].uses[0].otherActivityLocation).toBe("");
      expect(json.beacons[0].uses[0].otherActivityPeopleCount).toBe("");
    });

    it("should not serialise the max capacity if it is not a number", () => {
      registration.update({ maxCapacity: "not a number" });
      delete use.maxCapacity;
      const json = registration.serialiseToAPI();

      expect(json.beacons[0].uses[0]["maxCapacity"]).not.toBeDefined();
    });

    it("should not serialise the max capacity if it is not a whole number", () => {
      registration.update({ maxCapacity: "0.112" });
      delete use.maxCapacity;
      const json = registration.serialiseToAPI();

      expect(json.beacons[0].uses[0]["maxCapacity"]).not.toBeDefined();
    });

    it("should serialise all the communication information if selected", () => {
      registration.update({
        vhfRadio: ["false", "true"],
        fixedVhfRadio: ["false", "true"],
        portableVhfRadio: ["false", "true"],
        satelliteTelephone: ["false", "true"],
        mobileTelephone: ["false", "true"],
        otherCommunication: ["false", "true"],
      });

      const json = registration.serialiseToAPI();
      const firstUse = json.beacons[0].uses[0];
      expect(firstUse.vhfRadio).toBe(true);
      expect(firstUse.fixedVhfRadio).toBe(true);
      expect(firstUse.fixedVhfRadioValue).toBe("0117");
      expect(firstUse.portableVhfRadio).toBe(true);
      expect(firstUse.portableVhfRadioValue).toBe("0118");
      expect(firstUse.satelliteTelephone).toBe(true);
      expect(firstUse.satelliteTelephoneValue).toBe("0119");
      expect(firstUse.mobileTelephone).toBe(true);
      expect(firstUse.mobileTelephone1).toBe("01178123456");
      expect(firstUse.mobileTelephone2).toBe("01178123457");
      expect(firstUse.otherCommunication).toBe(true);
      expect(firstUse.otherCommunicationValue).toBe("Via email");
    });
  });
});
