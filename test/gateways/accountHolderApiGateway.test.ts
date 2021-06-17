import axios from "axios";
import { v4 } from "uuid";
import { AccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAccountHolderDetails } from "../../src/lib/accountHolder/accountHolderDetails";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Account Holder API Gateway", () => {
  let hostName = "a-host";
  let gateway: AccountHolderApiGateway;
  let token;

  describe("Getting an account holder id from an auth id", () => {
    const accountHolderIdEndpoint = "account-holder/auth-id";
    let authId;
    beforeEach(() => {
      authId = v4();
      token = v4();
      gateway = new AccountHolderApiGateway(hostName);
    });

    it("should request an accountHolderId from the correct endpoint", async () => {
      const expectedUrl = `${hostName}/${accountHolderIdEndpoint}/${authId}`;
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
          id: "any-account-holder-id",
        },
      });

      const result = await gateway.getAccountHolderId(authId, token);

      expect(result).toBe("any-account-holder-id");
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () => gateway.getAccountHolderId(authId, token);

      expect(call).rejects.toThrow();
    });
  });

  describe("Getting an account holder details", () => {
    const accountHolderDetailsEndpoint = "account-holder";
    let accountHolderId;

    beforeEach(() => {
      accountHolderId = v4();
      token = v4();
      gateway = new AccountHolderApiGateway(hostName);
    });

    it("should request account holder details from the correct endpoint", async () => {
      const expectedUrl = `${hostName}/${accountHolderDetailsEndpoint}/${accountHolderId}`;
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            id: "any id",
            attributes: {},
          },
        },
      });
      await gateway.getAccountHolderDetails(accountHolderId, token);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return account holder details", async () => {
      const mockResponse = {
        data: {
          id: accountHolderId,
          attributes: {
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
          },
        },
      };
      const expected = {
        id: accountHolderId,
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
      mockedAxios.get.mockResolvedValue({ data: { ...mockResponse } });

      const result = await gateway.getAccountHolderDetails(
        accountHolderId,
        token
      );
      expect(result).toMatchObject<IAccountHolderDetails>(expected);
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
