import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";
import { AccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAccountHolderIdResponseBody } from "../../src/lib/accountHolder/accountHolderIdResponseBody";

jest.mock("axios");

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

    it("should return account holder id", async () => {
      const expectedUrl = `${process.env.API_URL}/${endpoint}/${authId}`;
      (axios as any).get.mockImplementation(() => {
        return {
          data: {
            id: acountHolderId,
          },
        } as AxiosResponse<IAccountHolderIdResponseBody>;
      });

      const expected = await gateway.getAccountHolderId(authId, token);

      expect(expected).toBe(acountHolderId);
      expect((axios as any).get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  });
});
