import { BeaconSearchSortOptions } from "../../src/gateways/interfaces/BeaconSearchGateway";
import { getBeaconsForAccountHolder } from "./../../src/useCases/getBeaconsForAccountHolder";
describe("getBeaconsForAccountHolder", () => {
  const getBeaconsByAccountHolderEmailMock = jest.fn();
  const beaconSearchGateway = {
    getBeaconsByAccountHolderAndEmail: getBeaconsByAccountHolderEmailMock,
  };
  const accountHolderId = "1234-567-8910";
  const email = "beacons@beacons.com";
  const sortOptions: BeaconSearchSortOptions = {
    column: "lastModifiedDate",
    direction: "desc",
  };

  it("should format the dates", async () => {
    getBeaconsByAccountHolderEmailMock.mockImplementation(() => [
      {
        beaconStatus: "NEW",
        createdDate: "2021-03-20",
        lastModifiedDate: "2021-09-02",
      },
    ]);

    const result = await getBeaconsForAccountHolder({
      beaconSearchGateway,
    } as any)(accountHolderId, email, sortOptions);

    expect(result[0].createdDate).toBe("20 Mar 21");
    expect(result[0].lastModifiedDate).toBe("2 Sep 21");
  });

  it("should format a use with one activity", async () => {
    getBeaconsByAccountHolderEmailMock.mockImplementation(() => [
      {
        beaconStatus: "NEW",
        createdDate: "2021-03-20",
        lastModifiedDate: "2021-09-02",
        useActivities: "SAILING",
      },
    ]);

    const result = await getBeaconsForAccountHolder({
      beaconSearchGateway,
    } as any)(accountHolderId, email, sortOptions);

    expect(result[0].uses).toBe("Sailing");
  });

  it("should format a use with two activities", async () => {
    getBeaconsByAccountHolderEmailMock.mockImplementation(() => [
      {
        beaconStatus: "NEW",
        createdDate: "2021-03-20",
        lastModifiedDate: "2021-09-02",
        useActivities: "SAILING, DRIVING",
      },
    ]);

    const result = await getBeaconsForAccountHolder({
      beaconSearchGateway,
    } as any)(accountHolderId, email, sortOptions);

    expect(result[0].uses).toBe("Sailing, Driving");
  });

  it("should format a use with an activity that has an underscore", async () => {
    getBeaconsByAccountHolderEmailMock.mockImplementation(() => [
      {
        beaconStatus: "NEW",
        createdDate: "2021-03-20",
        lastModifiedDate: "2021-09-02",
        useActivities: "SAILING, CLIMBING_MOUNTAINEERING",
      },
    ]);

    const result = await getBeaconsForAccountHolder({
      beaconSearchGateway,
    } as any)(accountHolderId, email, sortOptions);

    expect(result[0].uses).toBe("Sailing, Climbing Mountaineering");
  });
});
