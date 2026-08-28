import * as _ from "lodash";
import { Beacon } from "../../src/entities/Beacon";
import { BeaconsApiResponseMapper } from "../../src/gateways/mappers/BeaconsApiResponseMapper";
import { beaconFixtures } from "../fixtures/beacons.fixture";
import { manyBeaconsApiResponseFixture } from "../fixtures/manyBeaconsApiResponse.fixture";
import { singleBeaconApiResponseFixture } from "../fixtures/singleBeaconApiResponse.fixture";

describe("BeaconsApiResponseMapper", () => {
  let responseMapper: BeaconsApiResponseMapper;
  let beaconApiResponse;

  let expectedBeacons: Beacon[];
  let expectedBeacon: Beacon;

  beforeEach(() => {
    responseMapper = new BeaconsApiResponseMapper();
    expectedBeacons = _.cloneDeep(beaconFixtures);
    expectedBeacon = expectedBeacons[0];
  });

  it("maps a beacon API response containing a single beacon to a Beacon", () => {
    beaconApiResponse = _.cloneDeep(singleBeaconApiResponseFixture);
    const mappedBeacon = responseMapper.map(beaconApiResponse);

    expect(mappedBeacon).toStrictEqual(expectedBeacon);
  });

  it("maps a beacon API response containing multiple beacons to a Beacon array", () => {
    beaconApiResponse = _.cloneDeep(manyBeaconsApiResponseFixture);
    const mappedBeacons = responseMapper.mapList(beaconApiResponse);

    expect(mappedBeacons).toStrictEqual(expectedBeacons);
  });

  it("keeps a single main use when the API returns several main uses", () => {
    beaconApiResponse = _.cloneDeep(singleBeaconApiResponseFixture);
    const [mainUse] = beaconApiResponse.uses;
    beaconApiResponse.uses = [
      { ...mainUse, id: "first-use-id" },
      { ...mainUse, id: "second-use-id" },
    ];

    const mappedBeacon = responseMapper.map(beaconApiResponse);

    expect(mappedBeacon.uses.map((use) => use.mainUse)).toEqual([true, false]);
  });
});
