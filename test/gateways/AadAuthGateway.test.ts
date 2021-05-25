import {
  AuthenticationResult,
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
        mockConfidentialClientApplication as IConfidentialClientApplication
      );
    });

    it("gets an access token", async () => {
      mockConfidentialClientApplication.acquireTokenByClientCredential = jest
        .fn()
        .mockResolvedValue(mockAuthenticationResult);

      const accessToken = await gateway.getAccessToken();

      expect(accessToken).toEqual(mockAccessToken);
    });
  });
});
