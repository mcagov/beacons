import { AccountInfo } from "@azure/msal-browser";
import { AuthGateway } from "./AuthGateway";

describe("AuthGateway", () => {
  describe("getAccessToken", () => {
    let mockAccount: AccountInfo;
    let mockAccessToken: string;
    let mockPublicClientApplication: any;
    let gateway: AuthGateway;
    let consoleSpy: any;

    beforeEach(() => {
      mockAccount = {
        homeAccountId: "mock_homeAccountId",
        environment: "mock_environment",
        tenantId: "mock_tenantId",
        username: "mock_username",
        localAccountId: "mock_localAccountId",
      };

      mockAccessToken = "mock_mockAccessToken";

      mockPublicClientApplication = {
        getAllAccounts: jest.fn(),
        acquireTokenSilent: jest.fn(),
      };
      gateway = new AuthGateway(mockPublicClientApplication);
      consoleSpy = jest.spyOn(console, "error").mockReturnValue();
    });

    afterEach(() => consoleSpy.mockRestore());

    it("gets an access token", async () => {
      mockPublicClientApplication.getAllAccounts = jest
        .fn()
        .mockReturnValue([mockAccount]);
      mockPublicClientApplication.acquireTokenSilent = jest
        .fn()
        .mockReturnValue(Promise.resolve({ accessToken: mockAccessToken }));

      const accessToken = await gateway.getAccessToken();

      expect(accessToken).toEqual(mockAccessToken);
    });

    it("re-throws the error if it cannot obtain account information", async () => {
      mockPublicClientApplication.getAllAccounts = jest
        .fn()
        .mockReturnValue(new Error());

      await expect(gateway.getAccessToken).rejects.toThrow();
    });

    it("re-throws the error if it cannot obtain an access token", async () => {
      mockPublicClientApplication.getAllAccounts = jest
        .fn()
        .mockReturnValue([mockAccount]);
      mockPublicClientApplication.acquireTokenSilent = jest
        .fn()
        .mockReturnValue(new Error());

      await expect(gateway.getAccessToken).rejects.toThrow();
    });
  });
});
