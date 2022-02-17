import { v4 } from "uuid";
import { Beacon } from "../../src/entities/Beacon";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getAccountHoldersRegistration } from "../../src/useCases/getAccountHoldersRegistration";
import { beaconFixtures } from "../fixtures/beacons.fixture";

describe("getAccountHoldersRegistration", () => {
  it("returns a Registration that matches both the Registration and AccountHolder IDs", async () => {
    const existingBeacon: Beacon = {
      ...beaconFixtures[0],
      id: v4(),
      accountHolderId: v4(),
    };
    const container: Partial<IAppContainer> = {
      accountHolderGateway: {
        getAccountBeacons: jest.fn().mockResolvedValue([existingBeacon]),
      } as any,
    };

    const registration = await getAccountHoldersRegistration(
      container as IAppContainer
    )(existingBeacon.id, existingBeacon.accountHolderId);

    expect(registration).toEqual(
      expect.objectContaining({
        id: existingBeacon.id,
        accountHolderId: existingBeacon.accountHolderId,
      })
    );
  });
});
