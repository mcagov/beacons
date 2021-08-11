import { rest } from "msw";
import { setupServer } from "msw/node";
import { v4 } from "uuid";
import { BeaconsApiAccountHolderGateway } from "../../../src/gateways/BeaconsApiAccountHolderGateway";
import { AccountHolderGateway } from "../../../src/gateways/interfaces/AccountHolderGateway";
import { AuthGateway } from "../../../src/gateways/interfaces/AuthGateway";
import { getAppContainer } from "../../../src/lib/appContainer";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { getServerSideProps } from "../../../src/pages/account/update-account";
import {
  accountDetailsResponseJson,
  accountIdFromAuthIdResponseJson,
} from "../../fixtures/accountResponses.fixture";

describe("UpdateAccount", () => {
  describe("GetServerSideProps", () => {
    const server = setupServer(
      rest.get("*/account-holder/auth-id/:authId", (req, res, ctx) => {
        return res(ctx.json({ ...accountIdFromAuthIdResponseJson }));
      }),
      rest.get("*/account-holder/:accountId", (req, res, ctx) => {
        return res(ctx.json({ ...accountDetailsResponseJson }));
      }),
      rest.patch("*/account-holder/:accountId", (req, res, ctx) => {
        return res(ctx.json({ ...accountDetailsResponseJson }));
      })
    );

    const mockAuthGateway: AuthGateway = {
      getAccessToken: jest.fn().mockResolvedValue(v4()),
    };

    const accountHolderApiGateway: AccountHolderGateway =
      new BeaconsApiAccountHolderGateway(process.env.API_URL, mockAuthGateway);

    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });

    it("should return form with account details for current user on page GET", async () => {
      const mockRequest: any = { method: "GET" };
      const containerMocks: Partial<IAppContainer> = {
        accountHolderGateway: accountHolderApiGateway,
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getAppContainer(containerMocks as IAppContainer),
        session: { user: { authId: "test-auth-id" } },
        req: mockRequest,
      };

      const result = (await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      )) as any;

      const fields = result.props.form.fields;
      expect(fields.fullName.value).toEqual("Tesy McTestface");
      expect(fields.telephoneNumber.value).toEqual("01178 657123");
      expect(fields.addressLine1.value).toEqual("Flat 42");
      expect(fields.addressLine2.value).toEqual("Testington Towers");
      expect(fields.townOrCity.value).toEqual("Testville");
      expect(fields.county.value).toEqual("Testershire");
      expect(fields.postcode.value).toEqual("TS1 23A");
      expect(fields.email.value).toEqual("testy@mctestface.com");
    });

    it("should return form with updated account details with field errors", async () => {
      const mockRequest: any = {
        method: "POST",
        headers: { contentType: "json" },
      };
      const containerMocks: Partial<IAppContainer> = {
        accountHolderGateway: accountHolderApiGateway,
        parseFormDataAs: jest.fn().mockResolvedValue({
          fullName: "new fullName",
          telephoneNumber: "new telephoneNumber",
          addressLine1: "new addressLine1",
          addressLine2: "new addressLine2",
          townOrCity: "new townOrCity",
          county: "new county",
          postcode: "invalid postcode",
        }),
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getAppContainer(containerMocks as IAppContainer),
        session: { user: { authId: "a-session-id" } },
        req: mockRequest,
      };

      const result = (await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      )) as any;

      const fields = result.props.form.fields;
      expect(fields.fullName.value).toEqual("new fullName");
      expect(fields.telephoneNumber.value).toEqual("new telephoneNumber");
      expect(fields.addressLine1.value).toEqual("new addressLine1");
      expect(fields.addressLine2.value).toEqual("new addressLine2");
      expect(fields.townOrCity.value).toEqual("new townOrCity");
      expect(fields.county.value).toEqual("new county");
      expect(fields.postcode.value).toEqual("invalid postcode");
      expect(fields.postcode.errorMessages[0]).toEqual(
        "Postcode must be a valid UK postcode"
      );
    });

    it("should redirect to home when post has no errors", async () => {
      const mockRequest: any = {
        method: "POST",
        headers: { contentType: "json" },
      };
      const containerMocks: Partial<IAppContainer> = {
        accountHolderGateway: accountHolderApiGateway,
        parseFormDataAs: jest.fn().mockResolvedValue({
          fullName: "new fullName",
          telephoneNumber: "new telephoneNumber",
          addressLine1: "new addressLine1",
          addressLine2: "new addressLine2",
          townOrCity: "new townOrCity",
          county: "new county",
          postcode: "bs7 9lm",
        }), // a valid postcode this time
      };

      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getAppContainer(containerMocks as IAppContainer),
        session: { user: { authId: "a-session-id" } },
        req: mockRequest,
      };

      const result = (await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      )) as any;

      expect(result.redirect.destination).toEqual(
        "/account/your-beacon-registry-account"
      );
    });

    it("should only PATCH updated fields", async () => {
      const mockRequest: any = {
        method: "POST",
        headers: { contentType: "json" },
      };
      const containerMocks: Partial<IAppContainer> = {
        accountHolderGateway: accountHolderApiGateway,
        updateAccountHolder: jest.fn(),
        parseFormDataAs: jest.fn().mockResolvedValue({
          fullName: "Sir David", //changed
          telephoneNumber: "07800 16 16 16", //changed
          addressLine1: "Flat 42",
          addressLine2: "Testington Towers",
          townOrCity: "Testville",
          county: "", //changed
          postcode: "TS1 2AB", //changed
        }),
      };

      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getAppContainer(containerMocks as IAppContainer),
        session: { user: { authId: "a-session-id" } },
        req: mockRequest,
      };

      await getServerSideProps(context as BeaconsGetServerSidePropsContext);

      expect(containerMocks.updateAccountHolder).toHaveBeenCalledWith(
        "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
        {
          fullName: "Sir David",
          telephoneNumber: "07800 16 16 16",
          county: "",
          postcode: "TS1 2AB",
        }
      );
    });
  });
});
