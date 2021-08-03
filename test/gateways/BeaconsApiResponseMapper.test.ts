import * as _ from "lodash";
import { Beacon } from "../../src/entities/Beacon";
import { BeaconsApiResponseMapper } from "../../src/gateways/mappers/BeaconsApiResponseMapper";
import { IBeaconListResponse } from "../../src/gateways/mappers/IBeaconListResponse";
import { beaconFixtures } from "../fixtures/beacons.fixture";
import { manyBeaconsApiResponseFixture } from "../fixtures/manyBeaconsApiResponse.fixture";

describe("BeaconsApiResponseMapper", () => {
  let beaconApiListResponse: IBeaconListResponse;

  let expectedBeacon: Beacon[];

  beforeEach(() => {
    beaconApiListResponse = _.cloneDeep(manyBeaconsApiResponseFixture);
    expectedBeacon = _.cloneDeep(beaconFixtures);
  });

  it("maps a beacon API response containing multiple beacons to an Beacon array", () => {
    const responseMapper = new BeaconsApiResponseMapper();

    const mappedBeacon = responseMapper.mapList(beaconApiListResponse);
    expect(mappedBeacon).toStrictEqual(expectedBeacon);
  });
});
