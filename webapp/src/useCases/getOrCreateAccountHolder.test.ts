import { AccountHolder } from "../entities/AccountHolder";
import { AccountHolderGateway } from "../../src/gateways/AccountHolderGateway";
import { IAppContainer } from "../lib/IAppContainer";
import { getOrCreateAccountHolder } from "./getOrCreateAccountHolder";

describe("The getOrCreateAccountHolder use case", () => {
  it("returns the existing account holder for a given auth id", async () => {
    const testId = "test-account-id";
    const testAccountHolder: Partial<AccountHolder> = { id: testId };
    const gateway: Partial<AccountHolderGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(testId),
      getAccountHolderDetails: jest.fn().mockResolvedValue(testAccountHolder),
    };
    const container: Partial<IAppContainer> = {
      accountHolderGateway: gateway as AccountHolderGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    const result = await getOrCreateAccountHolder(container as IAppContainer)(
      session
    );

    expect(result).toEqual(testAccountHolder);
  });

  it("creates a new account holder if one is not found for a given auth id", async () => {
    const gateway: Partial<AccountHolderGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(null),
      createAccountHolder: jest.fn(),
    };
    const container: Partial<IAppContainer> = {
      accountHolderGateway: gateway as AccountHolderGateway,
      getAccessToken: jest.fn(),
    };
    const session = { user: { authId: "a-session-id" } };

    await getOrCreateAccountHolder(container as IAppContainer)(session);

    expect(
      container.accountHolderGateway.createAccountHolder
    ).toHaveBeenCalledTimes(1);
  });
});
