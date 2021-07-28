import { IAppContainer } from "../../src/lib/IAppContainer";
import { deleteBeacon } from "../../src/useCases/deleteBeacon";

describe("Delete beacon use case", () => {
  it("should successfully delete the beacon", async () => {
    const container: Partial<IAppContainer> = {
      getAccessToken: jest.fn(async () => "access_token"),
      beaconsApiGateway: {
        deleteBeacon: jest.fn(async () => true),
      } as any,
    };

    const result = await deleteBeacon(container as any)(
      "Unused on my boat",
      "1234",
      "0987"
    );

    expect(result).toStrictEqual({ success: true });
    expect(container.beaconsApiGateway.deleteBeacon).toHaveBeenLastCalledWith(
      {
        reason: "Unused on my boat",
        beaconId: "1234",
        accountHolderId: "0987",
      },
      "access_token"
    );
    expect(container.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it("should return the result if the beacon is not sucessfully deleted", async () => {
    const container: Partial<IAppContainer> = {
      getAccessToken: jest.fn(async () => "access_token"),
      beaconsApiGateway: {
        deleteBeacon: jest.fn(async () => false),
      } as any,
    };

    const result = await deleteBeacon(container as any)(
      "Unused on my boat",
      "1234",
      "0987"
    );

    expect(result).toStrictEqual({ success: false });
  });
});
