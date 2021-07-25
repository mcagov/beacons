import { IAccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAppContainer } from "../../src/lib/appContainer";
import { getAccountHolderId } from "../../src/useCases/getAccountHolderId";

describe("The getAccountHolderId use case", () => {
  it("returns the existing account holder id a given auth id", async () => {
    const testId = "test-account-id";
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(testId),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    const result = await getAccountHolderId(container as IAppContainer)(
      session
    );

    expect(result).toEqual(testId);
  });

  it("return null if account holder is not found for a given auth id", async () => {
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(null),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    await getAccountHolderId(container as IAppContainer)(session);

    expect(
      container.accountHolderApiGateway.getAccountHolderId
    ).toHaveBeenCalledTimes(1);
  });
});
