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

  it("maps a beacon API response containing multiple beacons to an Beacon array", () => {
    beaconApiResponse = _.cloneDeep(manyBeaconsApiResponseFixture);
    const mappedBeacons = responseMapper.mapList(beaconApiResponse);

    expect(mappedBeacons).toStrictEqual(expectedBeacons);
  });
});
