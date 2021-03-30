/* eslint-disable @typescript-eslint/no-explicit-any */
import { Registration } from "../../../src/lib/registration/registration";
import {
  initBeacon,
  initBeaconUse,
} from "../../../src/lib/registration/registrationInitialisation";
import { BeaconEnvionment } from "../../../src/lib/registration/types";

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

  describe("updating beacon uses", () => {
    it("should update a beacon use with the values provided at the given index", () => {
      const formData = { useIndex: 0, environment: BeaconEnvionment.MARITIME };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(1);
      expect(registration.registration.uses[0].environment).toBe(
        BeaconEnvionment.MARITIME
      );
    });

    it("should update the first beacon use if no index is provided and there are two beacon uses", () => {
      registration.registration.uses.push(initBeaconUse());
      const formData = { environment: BeaconEnvionment.MARITIME };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(2);
      expect(registration.registration.uses[0].environment).toBe(
        BeaconEnvionment.MARITIME
      );
    });

    it("should update the latest beacon use if the index is greater than the length of the beacon use array", () => {
      const formData = {
        useIndex: 100,
        environment: BeaconEnvionment.MARITIME,
      };
      registration.update(formData);

      expect(registration.registration.uses.length).toBe(1);
      expect(registration.registration.uses[0].environment).toBe(
        BeaconEnvionment.MARITIME
      );
    });
  });

  describe("flattening the registration object", () => {
    it("should flatten the registration and return the first use if no index is provided", () => {
      const formData = { environment: BeaconEnvionment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: null }).environment
      ).toBe(BeaconEnvionment.MARITIME);
    });

    it("should flatten the registration and return use objects as top level keys", () => {
      const formData = { useIndex: 0, environment: BeaconEnvionment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: 0 }).environment
      ).toBe(BeaconEnvionment.MARITIME);
    });

    it("should return the latest beacon use information if the index is greater than the length of the array", () => {
      registration.registration.uses.push(initBeaconUse());
      const formData = { useIndex: 1, environment: BeaconEnvionment.MARITIME };
      registration.update(formData);

      expect(
        registration.getFlattenedRegistration({ useIndex: 100 }).environment
      ).toBe(BeaconEnvionment.MARITIME);
    });

    it("should remove the uses key from the flattened object", () => {
      expect(
        registration.getFlattenedRegistration({ useIndex: 0 }).uses
      ).toBeUndefined();
    });
  });
});
