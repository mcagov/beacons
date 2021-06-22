import { IAccountHolderDetails } from "../../../src/entities/accountHolderDetails";
import { IBeacon } from "../../../src/entities/beacon";
import { IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";
import { getOrCreateAccountId } from "../../../src/useCases/getOrCreateAccountId";
import { getMockAccountHolder, getMockBeacon } from "../../mocks";

describe("YourBeaconRegistyAccount", () => {
  describe("GetServerSideProps", () => {
    it("should contain correct account details for a given user", async () => {
      const expBeacons = [getMockBeacon() as IBeacon];
      const expAccount = getMockAccountHolder() as IAccountHolderDetails;

      const container: Partial<IAppContainer> = {
        accountHolderApiGateway: {
          getAccountHolderId: jest.fn().mockResolvedValue("an-account-id"),
          createAccountHolderId: jest.fn(),
          getAccountBeacons: jest.fn().mockResolvedValue(expBeacons),
          getAccountHolderDetails: jest.fn().mockResolvedValue(expAccount),
        },
        getAccessToken: jest.fn(),
        getSession: jest
          .fn()
          .mockResolvedValue({ user: { id: "a-session-id" } }),
      };

      container.getOrCreateAccountId = getOrCreateAccountId(
        container as IAppContainer
      );

      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: container as IAppContainer,
      };

      const result = await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      );
      console.log("res: ", JSON.stringify(result));

      expect(result["props"]["beacons"]).toBe(expBeacons);
    });
  });
});
