import { BeaconRequestMapper } from "../../../src/gateways/mappers/beaconRequestMapper";

describe("BeaconRequestMapper", () => {
  it("maps an empty IBeacon partial to an empty request", () => {
    const beaconRequestMapper = new BeaconRequestMapper();

    const mappedBeaconRequest = beaconRequestMapper.map(
      "9d7eb567-2212-4d71-8932-95536dd0b84e",
      {}
    );

    expect(mappedBeaconRequest).toStrictEqual({
      data: {
        type: "beacon",
        id: "9d7eb567-2212-4d71-8932-95536dd0b84e",
        attributes: {},
      },
    });
  });

  it("maps an IBeacon partial to a request populated with the same information", () => {
    const beaconRequestMapper = new BeaconRequestMapper();

    const mappedBeaconRequest = beaconRequestMapper.map(
      "9d7eb567-2212-4d71-8932-95536dd0b84e",
      {
        batteryExpiryDate: "2021-04-20",
      }
    );

    expect(mappedBeaconRequest).toStrictEqual({
      data: {
        type: "beacon",
        id: "9d7eb567-2212-4d71-8932-95536dd0b84e",
        attributes: {
          batteryExpiryDate: "2021-04-20",
        },
      },
    });
  });

  it("maps another IBeacon partial to a request populated with the same information", () => {
    const beaconRequestMapper = new BeaconRequestMapper();

    const mappedBeaconRequest = beaconRequestMapper.map(
      "9d7eb567-2212-4d71-8932-95536dd0b84e",
      {
        batteryExpiryDate: "2021-04-20",
        model: "Beaconater 3000",
      }
    );

    expect(mappedBeaconRequest).toStrictEqual({
      data: {
        type: "beacon",
        id: "9d7eb567-2212-4d71-8932-95536dd0b84e",
        attributes: {
          batteryExpiryDate: "2021-04-20",
          model: "Beaconater 3000",
        },
      },
    });
  });

  it("maps all IBeacon fields correctly", () => {
    const beaconRequestMapper = new BeaconRequestMapper();

    const mappedBeaconRequest = beaconRequestMapper.map(
      "9d7eb567-2212-4d71-8932-95536dd0b84e",
      {
        id: "9d7eb567-2212-4d71-8932-95536dd0b84e",
        hexId: "1D0EA08C52FFBFF",
        type: "EPIRB",
        protocolCode: "34ABD",
        registeredDate: "21-10-2011",
        status: "Registered",
        manufacturer: "Ocean Signal",
        model: "Beaconater 3000",
        manufacturerSerialNumber: "BCNTR3000",
        chkCode: "45YU",
        batteryExpiryDate: "2021-04-20",
        lastServicedDate: "20-04-2021",
      }
    );

    expect(mappedBeaconRequest).toStrictEqual({
      data: {
        type: "beacon",
        id: "9d7eb567-2212-4d71-8932-95536dd0b84e",
        attributes: {
          hexId: "1D0EA08C52FFBFF",
          type: "EPIRB",
          protocolCode: "34ABD",
          registeredDate: "21-10-2011",
          status: "Registered",
          manufacturer: "Ocean Signal",
          model: "Beaconater 3000",
          manufacturerSerialNumber: "BCNTR3000",
          chkCode: "45YU",
          batteryExpiryDate: "2021-04-20",
          lastServicedDate: "20-04-2021",
        },
      },
    });
  });
});
