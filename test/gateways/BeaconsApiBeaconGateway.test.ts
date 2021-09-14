import axios from "axios";
import { v4 } from "uuid";
import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { BeaconsApiBeaconGateway } from "../../src/gateways/BeaconsApiBeaconGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";

jest.mock("axios");

describe("Beacons API Gateway", () => {
  let gateway: BeaconsApiBeaconGateway;
  let apiUrl: string;
  let mockAuthGateway: AuthGateway;

  beforeEach(() => {
    apiUrl = "http://localhost:8080/spring-api";
    mockAuthGateway = {
      getAccessToken: jest.fn().mockResolvedValue("Access token"),
    };
    gateway = new BeaconsApiBeaconGateway(apiUrl, mockAuthGateway);
    jest.resetAllMocks();
  });

  describe("Posting an entity", () => {
    let endpoint;
    let json: DraftRegistration;

    beforeEach(() => {
      endpoint = "registrations/register";
      json = { model: "ASOS", uses: [] };
    });

    it("should return true if it posted the entity successfully", async () => {
      const expected = await gateway.sendRegistration(json);
      expect(expected).toBe(true);
    });

    it("should return false if the request is unsuccessful", async () => {
      (axios as any).post.mockImplementation(() => {
        throw new Error();
      });
      const expected = await gateway.sendRegistration(json);
      expect(expected).toBe(false);
    });

    it("should send the JSON to the correct url", async () => {
      const expectedUrl = `${apiUrl}/${endpoint}`;
      await gateway.sendRegistration(json);
      expect((axios as any).post).toHaveBeenLastCalledWith(
        expectedUrl,
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe("Updating a registration", () => {
    let endpoint;
    let json: DraftRegistration;
    let registrationId;

    beforeEach(() => {
      endpoint = "registrations/register";
      json = { model: "ASOS", uses: [] };
      registrationId = v4();
    });

    it("should return true if it posted the entity successfully", async () => {
      const expected = await gateway.updateRegistration(json, registrationId);
      expect(expected).toBe(true);
    });

    it("should return false if the request is unsuccessful", async () => {
      (axios as any).patch.mockImplementation(() => {
        throw new Error();
      });
      const expected = await gateway.updateRegistration(json, registrationId);
      expect(expected).toBe(false);
    });

    it("should send the JSON to the correct url", async () => {
      const expectedUrl = `${apiUrl}/${endpoint}/${registrationId}`;
      await gateway.updateRegistration(json, registrationId);
      expect((axios as any).patch).toHaveBeenLastCalledWith(
        expectedUrl,
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe("Deleting a beacon", () => {
    let json;

    beforeEach(() => {
      json = {
        beaconId: "1234",
        accountHolderId: "0987",
        reason: "Unused on my boat anymore",
      };
    });

    it("should return true if it deleted the entity successfully", async () => {
      const expected = await gateway.deleteBeacon(json);
      expect(expected).toBe(true);
    });

    it("should return false if the delete is unsuccessful", async () => {
      (axios as any).patch.mockImplementation(() => {
        throw new Error();
      });

      const expected = await gateway.deleteBeacon(json);
      expect(expected).toBe(false);
    });

    it("should send the JSON to the correct endpoint", async () => {
      const expectedUrl = `${apiUrl}/beacons/1234/delete`;
      const expectedJson = {
        beaconId: "1234",
        userId: "0987",
        reason: "Unused on my boat anymore",
      };

      await gateway.deleteBeacon(json);
      expect((axios as any).patch).toHaveBeenLastCalledWith(
        expectedUrl,
        expectedJson,
        expect.anything()
      );
    });
  });
});
