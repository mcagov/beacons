import { AccountHolderGateway } from "../../src/gateways/AccountHolderGateway";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getAccountHolderId } from "../../src/useCases/getAccountHolderId";

describe("The getAccountHolderId use case", () => {
  it("returns the existing account holder id a given auth id", async () => {
    const testId = "test-account-id";
    const gateway: Partial<AccountHolderGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(testId),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as AccountHolderGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    const result = await getAccountHolderId(container as IAppContainer)(
      session
    );

    expect(result).toEqual(testId);
  });

  it("return null if account holder is not found for a given auth id", async () => {
    const gateway: Partial<AccountHolderGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(null),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as AccountHolderGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    await getAccountHolderId(container as IAppContainer)(session);

    expect(
      container.accountHolderApiGateway.getAccountHolderId
    ).toHaveBeenCalledTimes(1);
  });
});
