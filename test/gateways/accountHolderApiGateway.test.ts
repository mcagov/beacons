import axios from "axios";
import { v4 } from "uuid";
import { AccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Account Holder API Gateway", () => {
  let gateway: AccountHolderApiGateway;
  const endpoint = "account-holder/auth-id";

  beforeEach(() => {
    gateway = new AccountHolderApiGateway();
  });

  describe("Getting an account holder", () => {
    let authId;
    let acountHolderId;
    let token;

    beforeEach(() => {
      authId = v4();
      acountHolderId = v4();
      token = v4();
    });

    it("should request an accountHolderId from the correct endpoint", async () => {
      const expectedUrl = `${process.env.API_URL}/${endpoint}/${authId}`;
      mockedAxios.get.mockResolvedValue({
        data: {
          id: "any id",
        },
      });

      await gateway.getAccountHolderId(authId, token);

      expect((axios as any).get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return the obtained accountHolderId from the API", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          id: acountHolderId,
        },
      });

      const expected = await gateway.getAccountHolderId(authId, token);

      expect(expected).toBe(acountHolderId);
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () => gateway.getAccountHolderId(authId, token);

      expect(call).rejects.toThrow();
    });
  });
});
