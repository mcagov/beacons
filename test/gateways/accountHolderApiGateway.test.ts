import axios from "axios";
import { v4 } from "uuid";
import { AccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAccountHolderDetailsResponseBody } from "../../src/lib/accountHolder/accountHolderDetailsResponseBody";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Account Holder API Gateway", () => {
  let gateway: AccountHolderApiGateway;
  const accountHolderIdEndpoint = "account-holder/auth-id";
  const accountHolderDetailsEndpoint = "account-holder";
  let authId;
  let accountHolderId;
  let token;

  describe("Getting an account holder id from an auth id", () => {
    beforeEach(() => {
      authId = v4();
      token = v4();
      gateway = new AccountHolderApiGateway();
    });

    it("should request an accountHolderId from the correct endpoint", async () => {
      const expectedUrl = `${process.env.API_URL}/${accountHolderIdEndpoint}/${authId}`;
      mockedAxios.get.mockResolvedValue({
        data: {
          id: "any id",
        },
      });

      await gateway.getAccountHolderId(authId, token);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return the obtained accountHolderId from the API", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          id: accountHolderId,
        },
      });

      const result = await gateway.getAccountHolderId(authId, token);

      expect(result).toBe(accountHolderId);
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () => gateway.getAccountHolderId(authId, token);

      expect(call).rejects.toThrow();
    });
  });

  describe("Getting an account holder details", () => {
    beforeEach(() => {
      accountHolderId = v4();
      token = v4();
      gateway = new AccountHolderApiGateway();
    });

    it("should request account holder details from the correct endpoint", async () => {
      const expectedUrl = `${process.env.API_URL}/${accountHolderDetailsEndpoint}/${accountHolderId}`;
      await gateway.getAccountHolderDetails(accountHolderId, token);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return account holder details", async () => {
      const expected = {
        id: "number-1",
        fullName: "Bill Gates",
        email: "bill@billynomates.test",
        telephoneNumber: "0788888888",
        alternativeTelephoneNumber: "NA",
        addressLine1: "Evil Lair",
        addressLine2: "1 Microsoft Square",
        addressLine3: "",
        addressLine4: "",
        townOrCity: "Googleville",
        county: "Lancs",
        postcode: "ZX80 CPC",
      };
      mockedAxios.get.mockResolvedValue({ data: { ...expected } });

      const result = await gateway.getAccountHolderDetails(
        accountHolderId,
        token
      );
      expect(result).toMatchObject<IAccountHolderDetailsResponseBody>(expected);
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () =>
        gateway.getAccountHolderDetails(accountHolderId, token);

      expect(call).rejects.toThrow();
    });
  });
});
