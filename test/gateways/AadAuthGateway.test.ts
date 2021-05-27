import {
  AuthenticationResult,
  ConfidentialClientApplication,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { AadAuthGateway } from "../../src/gateways/AadAuthGateway";
import { IAuthGateway } from "../../src/gateways/IAuthGateway";

describe("AadAuthGateway", () => {
  describe("getAccessToken", () => {
    let mockConfidentialClientApplication: Partial<IConfidentialClientApplication>;
    let mockAccessToken: string;
    let mockAuthenticationResult: Partial<AuthenticationResult>;
    let gateway: IAuthGateway;

    beforeEach(() => {
      mockAccessToken = "mock_accessToken";
      mockAuthenticationResult = { accessToken: mockAccessToken };
      mockConfidentialClientApplication = {
        acquireTokenByClientCredential: jest.fn(),
      };
      gateway = new AadAuthGateway(
        mockConfidentialClientApplication as ConfidentialClientApplication
      );
    });

    it("gets an access token", async () => {
      mockConfidentialClientApplication.acquireTokenByClientCredential = jest
        .fn()
        .mockResolvedValue(mockAuthenticationResult);

      const accessToken = await gateway.getAccessToken();

      expect(accessToken).toEqual(mockAccessToken);
    });

    it("throws an error if it can't get an access token", async () => {
      mockConfidentialClientApplication.acquireTokenByClientCredential = jest
        .fn()
        .mockResolvedValue(new Error());
      jest.spyOn(console, "error").mockReturnValue();

      await expect(gateway.getAccessToken).rejects.toThrowError();
    });
  });
});
