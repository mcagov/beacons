import { rest } from "msw";
import { setupServer } from "msw/node";
import { getAppContainer, IAppContainer } from "../../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/container";
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

    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });

    let containerMocks: Partial<IAppContainer>;

    const getContainer = () =>
      getAppContainer(containerMocks as IAppContainer) as IAppContainer;

    beforeEach(() => {
      containerMocks = {
        getAccessToken: jest.fn(),
        getSession: jest
          .fn()
          .mockResolvedValue({ user: { id: "a-session-id" } }),
      };
    });

    it("should return form with account details for current user on page GET", async () => {
      const mockRequest: any = { method: "GET" };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getContainer(),
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
      containerMocks.parseFormDataAs = jest.fn().mockResolvedValue({
        fullName: "new fullName",
        telephoneNumber: "new telephoneNumber",
        addressLine1: "new addressLine1",
        addressLine2: "new addressLine2",
        townOrCity: "new townOrCity",
        county: "new county",
        postcode: "invalid postcode",
      });

      const mockRequest: any = {
        method: "POST",
        headers: { contentType: "json" },
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getContainer(),
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
      containerMocks.parseFormDataAs = jest.fn().mockResolvedValue({
        fullName: "new fullName",
        telephoneNumber: "new telephoneNumber",
        addressLine1: "new addressLine1",
        addressLine2: "new addressLine2",
        townOrCity: "new townOrCity",
        county: "new county",
        postcode: "bs7 9lm", // a valid postcode this time
      });

      const mockRequest: any = {
        method: "POST",
        headers: { contentType: "json" },
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        container: getContainer(),
        req: mockRequest,
      };

      const result = (await getServerSideProps(
        context as BeaconsGetServerSidePropsContext
      )) as any;

      expect(result.redirect.destination).toEqual(
        "/account/your-beacon-registry-account"
      );
    });
  });
});
