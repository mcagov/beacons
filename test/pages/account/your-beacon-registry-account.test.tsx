import { IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";

describe("YourBeaconRegistyAccount", () => {
  describe("GetServerSideProps", () => {
    it("should contain correct account details for a given user", async () => {
      const accountDetails = { id: "123" };
      const beacons = [];

      const container: Partial<IAppContainer> = {
        getAccountDetails: jest.fn().mockResolvedValue(accountDetails),
        getBeaconsByAccountHolderId: jest.fn().mockResolvedValue(beacons),
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: container as IAppContainer,
      };

      const result = await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      );

      expect(result["props"]["accountHolderDetails"]).toBe(accountDetails);
      expect(result["props"]["beacons"]).toBe(beacons);
    });
  });
});
