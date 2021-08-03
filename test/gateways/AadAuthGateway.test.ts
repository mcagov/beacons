import {
  AuthenticationResult,
  ConfidentialClientApplication,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { AadAuthGateway } from "../../src/gateways/AadAuthGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";

describe("AadAuthGateway", () => {
  describe("getAccessToken", () => {
    let mockConfidentialClientApplication: Partial<IConfidentialClientApplication>;
    let mockAccessToken: string;
    let mockAuthenticationResult: Partial<AuthenticationResult>;
    let gateway: AuthGateway;

    beforeEach(() => {
      mockAccessToken = "mock_accessToken";
      mockAuthenticationResult = { accessToken: mockAccessToken };
      mockConfidentialClientApplication = {
        acquireTokenByClientCredential: jest.fn(),
      };
      gateway = new AadAuthGateway();
    });

    it("gets an access token", async () => {
      mockConfidentialClientApplication.acquireTokenByClientCredential = jest
        .fn()
        .mockResolvedValue(mockAuthenticationResult);

      const accessToken = await gateway.getAccessToken(
        mockConfidentialClientApplication as ConfidentialClientApplication
      );

      expect(accessToken).toEqual(mockAccessToken);
    });

    it("throws an error if it can't get an access token", async () => {
      mockConfidentialClientApplication.acquireTokenByClientCredential = jest
        .fn()
        .mockImplementation(() => {
          throw new Error();
        });
      jest.spyOn(console, "error").mockReturnValue();

      await expect(
        gateway.getAccessToken(
          mockConfidentialClientApplication as ConfidentialClientApplication
        )
      ).rejects.toThrowError();
    });
  });
});
