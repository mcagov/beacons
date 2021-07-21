import { IAccountHolderDetails } from "../../src/entities/accountHolderDetails";
import { IAccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAppContainer } from "../../src/lib/appContainer";
import { getOrCreateAccountHolder } from "../../src/useCases/getOrCreateAccountHolder";

describe("The getOrCreateAccountHolder use case", () => {
  it("returns the existing account holder for a given auth id", async () => {
    const testId = "test-account-id";
    const testAccountHolder: Partial<IAccountHolderDetails> = { id: testId };
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(testId),
      getAccountHolderDetails: jest.fn().mockResolvedValue(testAccountHolder),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    const result = await getOrCreateAccountHolder(container as IAppContainer)(
      session
    );

    expect(result).toEqual(testAccountHolder);
  });

  it("creates a new account holder if one is not found for a given auth id", async () => {
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(null),
      createAccountHolder: jest.fn(),
    };
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    await getOrCreateAccountHolder(container as IAppContainer)(session);

    expect(
      container.accountHolderApiGateway.createAccountHolder
    ).toHaveBeenCalledTimes(1);
  });
});
