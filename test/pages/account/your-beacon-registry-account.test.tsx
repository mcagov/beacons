import { rest } from "msw";
import { setupServer } from "msw/node";
import { v4 } from "uuid";
import { BeaconsApiAccountHolderGateway } from "../../../src/gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconSearchGateway } from "../../../src/gateways/BeaconsApiBeaconSearchGateway";
import { AuthGateway } from "../../../src/gateways/interfaces/AuthGateway";
import { getAppContainer } from "../../../src/lib/appContainer";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { getServerSideProps } from "../../../src/pages/account/your-beacon-registry-account";
import { accountHolderFixture } from "../../fixtures/accountHolder.fixture";
import {
  accountDetailsResponseJson,
  accountIdFromAuthIdResponseJson,
} from "../../fixtures/accountResponses.fixture";
import { manyBeaconsApiResponseFixture } from "../../fixtures/manyBeaconsApiResponse.fixture";

describe("YourBeaconRegistryAccount", () => {
  const mockAuthGateway: AuthGateway = {
    getAccessToken: jest.fn().mockResolvedValue(v4()),
  };
  const mockSessionGateway = {
    getSession: jest.fn().mockReturnValue({ user: { authId: "a-session-id" } }),
  };
  const mocks: Partial<IAppContainer> = {
    accountHolderGateway: new BeaconsApiAccountHolderGateway(
      process.env.API_URL,
      mockAuthGateway
    ),
    sessionGateway: mockSessionGateway as any,
    beaconSearchGateway: new BeaconsApiBeaconSearchGateway(
      process.env.API_URL,
      mockAuthGateway
    ),
  };

  describe("GetServerSideProps for user with full account details", () => {
    const server = setupServer(
      rest.get("*/account-holder/auth-id/:authId", (req, res, ctx) => {
        return res(ctx.json({ ...accountIdFromAuthIdResponseJson }));
      }),
      rest.get("*/account-holder/:accountId", (req, res, ctx) => {
        return res(
          ctx.json({ ...accountDetailsResponseJson("Testy McTestface") })
        );
      }),
      rest.get(
        "*/beacon-search/search/find-all-by-account-holder-and-email",
        (req, res, ctx) => {
          return res(
            ctx.json({
              _embedded: {
                beaconSearch: [
                  {
                    id: "123",
                    hexId: "1D0",
                    beaconStatus: "NEW",
                    createdDate: "2021-03-20",
                    lastModifiedDate: "2021-09-02",
                    useActivities: "SAILING",
                    ownerName: "Beacon woman",
                  },
                ],
              },
            })
          );
        }
      )
    );

    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });

    it("should contain correct account details for a given user", async () => {
      const container = getAppContainer(mocks as IAppContainer);
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: container as IAppContainer,
        session: { user: { authId: "a-session-id" } },
        req: {
          cookies: {
            [formSubmissionCookieId]: "set",
          },
          method: "GET",
        } as any,
      };

      const result = await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      );

      expect(result["props"]["accountHolderDetails"]).toEqual(
        accountHolderFixture
      );
      expect(result["props"]["beacons"]).toStrictEqual([
        {
          id: "123",
          hexId: "1D0",
          beaconStatus: "NEW",
          createdDate: "20 Mar 21",
          lastModifiedDate: "2 Sep 21",
          ownerName: "Beacon woman",
          uses: "Sailing",
        },
      ]);
    });
  });

  describe("GetServerSideProps for user with account detail missing", () => {
    const server = setupServer(
      rest.get("*/account-holder/auth-id/:authId", (req, res, ctx) => {
        return res(ctx.json({ ...accountIdFromAuthIdResponseJson }));
      }),
      rest.get("*/account-holder/:accountId", (req, res, ctx) => {
        return res(ctx.json({ ...accountDetailsResponseJson("") }));
      }),
      rest.get("*/account-holder/:accountId/beacons", (req, res, ctx) => {
        return res(ctx.json({ ...manyBeaconsApiResponseFixture }));
      })
    );

    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });

    it("should redirect to account updates if account details are invalid", async () => {
      const container = getAppContainer(mocks as IAppContainer);
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container,
        session: { user: { authId: "a-session-id" } },
        req: {
          cookies: {
            [formSubmissionCookieId]: "set",
          },
          method: "GET",
        } as any,
      };

      const result = (await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      )) as any;

      expect(result.redirect.destination).toEqual("/account/update-account");
    });
  });
});
