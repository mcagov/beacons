import * as _ from "lodash";
import { IBeacon } from "../../src/entities/beacon";
import { IBeaconListResponse } from "../../src/gateways/mappers/beaconResponse";
import { BeaconResponseMapper } from "../../src/gateways/mappers/beaconResponseMapper";
import { beaconFixtures } from "../fixtures/beacons.fixture";
import { manyBeaconsApiResponseFixture } from "../fixtures/manyBeaconsApiResponse.fixture";

describe("BeaconResponseMapper", () => {
  let beaconApiListResponse: IBeaconListResponse;

  let expectedBeacon: IBeacon[];

  beforeEach(() => {
    beaconApiListResponse = _.cloneDeep(manyBeaconsApiResponseFixture);
    expectedBeacon = _.cloneDeep(beaconFixtures);
  });

  it("maps a beacon API response containing multiple beacons to an IBeacon array", () => {
    const responseMapper = new BeaconResponseMapper();

    const mappedBeacon = responseMapper.mapList(beaconApiListResponse);
    expect(mappedBeacon).toStrictEqual(expectedBeacon);
  });
});
