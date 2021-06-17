import { appContainer, IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";
import { getMockAccountHolder, getMockBeacon } from "../../mocks";

describe("YourBeaconRegistyAccount", () => {
  describe("GetServerSideProps", () => {
    it("should contain correct account details for a given user", async () => {
      const container: Partial<IAppContainer> = {
        getSession: jest
          .fn()
          .mockResolvedValue({ user: { id: "a-session-id" } }),
        accountHolderApiGateway: {
          getAccountHolderId: jest.fn().mockResolvedValue("an-account-id"),
          createAccountHolderId: jest.fn(),
          getAccountBeacons: jest
            .fn()
            .mockResolvedValue([getMockBeacon(), getMockBeacon()]),
          getAccountHolderDetails: jest
            .fn()
            .mockResolvedValue(getMockAccountHolder()),
        },
        getAccessToken: jest.fn(),
        getAccountDetails: appContainer.getAccountDetails,
        getAccountBeacons: appContainer.getAccountBeacons,
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: container as IAppContainer,
      };

      const result = await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      );

      console.log(result);
    });
  });
});
