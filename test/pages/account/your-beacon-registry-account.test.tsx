import axios from "axios";
import { appContainer, IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";
import { getOrCreateAccountId } from "../../../src/useCases/getOrCreateAccountId";
import { accountHolderFixture } from "../../fixtures/accountHolder.fixture";
import {
  accountDetailsResponseJson,
  accountIdFromAuthIdResponseJson,
} from "../../fixtures/accountResponses.fixture";
import { beaconFixtures } from "../../fixtures/beacons.fixture";
import { manyBeaconsApiResponseFixture } from "../../fixtures/manyBeaconsApiResponse.fixture";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("YourBeaconRegistyAccount", () => {
  describe("GetServerSideProps", () => {
    it("should contain correct account details for a given user", async () => {
      mockedAxios.get
        .mockImplementationOnce(async () => {
          return { data: { ...accountIdFromAuthIdResponseJson } };
        })
        .mockImplementationOnce(async () => {
          return {
            data: {
              ...accountDetailsResponseJson,
            },
          };
        })
        .mockImplementationOnce(async () => {
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

      expect(result["props"]["accountHolderDetails"]).toEqual(
        accountHolderFixture
      );
      expect(result["props"]["beacons"]).toEqual(beaconFixtures);
    });
  });
});
