import axios from "axios";
import { appContainer, IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";
import { getOrCreateAccountId } from "../../../src/useCases/getOrCreateAccountId";
import { manyBeaconsApiResponseFixture } from "../../fixtures/manyBeaconsApiResponse.fixture";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("YourBeaconRegistyAccount", () => {
  describe("GetServerSideProps", () => {
    it("should contain correct account details for a given user", async () => {
      mockedAxios.get
        .mockImplementationOnce(async (url) => {
          return { data: { id: "xxx" } };
        })
        .mockImplementationOnce(async (url) => {
          return {
            data: {
              data: { id: "xxx", attributes: { fullName: "the full name" } },
            },
          };
        })
        .mockImplementationOnce(async (url) => {
          return {
            data: {
              ...manyBeaconsApiResponseFixture,
            },
          };
        });

      const container: Partial<IAppContainer> = {
        accountHolderApiGateway: appContainer.accountHolderApiGateway,
        getAccessToken: jest.fn(),
        getSession: jest
          .fn()
          .mockResolvedValue({ user: { id: "a-session-id" } }),
        govNotifyGateway: {
          sendEmail: jest.fn(),
        },
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

      //expect(result["props"]["beacons"]).toBe(expBeacons);
    });
  });
});
