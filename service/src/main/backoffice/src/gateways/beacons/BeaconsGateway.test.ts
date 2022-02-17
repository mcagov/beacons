import axios from "axios";
import { applicationConfig } from "config";
import { IBeacon } from "entities/IBeacon";
import { beaconFixture } from "fixtures/beacons.fixture";
import { singleBeaconApiResponseFixture } from "fixtures/singleBeaconApiResponse.fixture";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IBeaconRequestMapper } from "gateways/mappers/BeaconRequestMapper";
import { IBeaconResponseMapper } from "gateways/mappers/BeaconResponseMapper";
import { ILegacyBeaconResponseMapper } from "gateways/mappers/LegacyBeaconResponseMapper";
import { BeaconsGateway } from "./BeaconsGateway";

jest.mock("axios");
jest.useFakeTimers();

describe("BeaconsGateway", () => {
  let beaconResponseMapper: IBeaconResponseMapper;
  let legacyBeaconResponseMapper: ILegacyBeaconResponseMapper;
  let beaconRequestMapper: IBeaconRequestMapper;
  let accessToken: string;
  let authGateway: IAuthGateway;
  let config: any;
  let consoleSpy: any;

  beforeEach(() => {
    beaconResponseMapper = {
      map: jest.fn(),
    };
    legacyBeaconResponseMapper = {
      map: jest.fn(),
    };
    beaconRequestMapper = {
      map: jest.fn(),
    };
    accessToken = "LET.ME.IN";
    authGateway = {
      getAccessToken: jest.fn().mockResolvedValue(accessToken),
    };
    config = {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    consoleSpy = jest.spyOn(console, "error").mockReturnValue();
  });

  afterEach(() => consoleSpy.mockRestore());

  describe("getAllBeacons()", () => {
    it("queries the correct endpoint", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );

      // @ts-ignore
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: {} }));

      await gateway.getAllBeacons("", {}, 0, 20, null);

      expect(axios.get).toHaveBeenCalledWith(
        `${applicationConfig.apiUrl}/beacon-search/search/find-allv2?term=&status=&uses=\
&hexId=&ownerName=&cospasSarsatNumber=&manufacturerSerialNumber=&page=0&size=20&sort=`,
        config
      );
    });

    it("handles errors", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );

      // @ts-ignore
      axios.get.mockImplementationOnce(() => Promise.reject(new Error()));

      await expect(gateway.getAllBeacons()).rejects.toThrow();
    });
  });

  describe("getBeacon()", () => {
    it("queries the correct endpoint", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );
      const beaconId = "f48e8212-2e10-4154-95c7-bdfd061bcfd2";
      // @ts-ignore
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: {} }));

      await gateway.getBeacon(beaconId);

      expect(axios.get).toHaveBeenCalledWith(
        `${applicationConfig.apiUrl}/registrations/${beaconId}`,
        config
      );
    });

    it("handles errors", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );

      // @ts-ignore
      axios.get.mockImplementationOnce(() => Promise.reject(new Error()));

      await expect(gateway.getAllBeacons()).rejects.toThrow();
    });

    it("calls its mapper to translate the API response to a domain object", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );
      const beaconId = "f48e8212-2e10-4154-95c7-bdfd061bcfd2";

      // @ts-ignore
      axios.get.mockImplementation(() =>
        Promise.resolve({ data: singleBeaconApiResponseFixture })
      );

      await gateway.getBeacon(beaconId);

      expect(beaconResponseMapper.map).toHaveBeenCalledWith(
        singleBeaconApiResponseFixture
      );
    });
  });

  describe("updateBeacon()", () => {
    const updateBeaconRequest = {
      data: {
        type: "beacon",
        id: beaconFixture.id,
        attributes: {
          manufacturer: "ACME Inc.",
        },
      },
    };

    const updateBeaconResponse = {
      meta: {},
      included: [],
      data: {
        type: "beacon",
        id: beaconFixture.id,
        attributes: {
          hexId: beaconFixture.hexId,
          status: beaconFixture.status,
          beaconType: beaconFixture.beaconType,
          manufacturer: "ACME Inc.",
          createdDate: beaconFixture.registeredDate,
          model: beaconFixture.model,
          manufacturerSerialNumber: beaconFixture.manufacturerSerialNumber,
          chkCode: beaconFixture.chkCode,
          protocol: beaconFixture.protocol,
          coding: beaconFixture.coding,
          batteryExpiryDate: beaconFixture.batteryExpiryDate,
          lastServicedDate: beaconFixture.lastServicedDate,
        },
        relationships: {
          uses: {
            data: [],
          },
          owner: {
            data: [],
          },
          emergencyContacts: {
            data: [],
          },
        },
      },
    };

    it("sends a PATCH request to the correct endpoint", async () => {
      beaconRequestMapper.map = jest.fn().mockReturnValue(updateBeaconRequest);
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );
      const updatedFieldsOnly: Partial<IBeacon> = { manufacturer: "ACME Inc." };
      // @ts-ignore
      axios.patch.mockResolvedValue({ status: 200, updateBeaconResponse });

      await gateway.updateBeacon(beaconFixture.id, updatedFieldsOnly);

      expect(axios.patch).toHaveBeenCalledWith(
        `${applicationConfig.apiUrl}/beacons/${beaconFixture.id}`,
        updateBeaconRequest,
        config
      );
    });

    it("calls its mapper to translate the domain object to a valid API request", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );
      const updatedFieldsOnly: Partial<IBeacon> = { manufacturer: "ACME Inc." };
      // @ts-ignore
      axios.patch.mockResolvedValue({
        status: 200,
        data: updateBeaconResponse,
      });

      await gateway.updateBeacon(beaconFixture.id, updatedFieldsOnly);

      expect(beaconRequestMapper.map).toHaveBeenCalledWith(
        beaconFixture.id,
        updatedFieldsOnly
      );
    });

    it("handles errors", async () => {
      const gateway = new BeaconsGateway(
        beaconResponseMapper,
        legacyBeaconResponseMapper,
        beaconRequestMapper,
        authGateway
      );
      // @ts-ignore
      axios.patch.mockImplementationOnce(() => Promise.reject(new Error()));

      await expect(
        gateway.updateBeacon(beaconFixture.id, { model: "iBeacon" })
      ).rejects.toThrow();
    });
  });
});
