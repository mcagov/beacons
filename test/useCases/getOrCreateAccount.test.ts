import { GetServerSidePropsContext } from "next";
import { IAccountHolderDetails } from "../../src/entities/accountHolderDetails";
import { IAppContainer } from "../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../src/lib/container";
import { getOrCreateAccount } from "../../src/useCases/getOrCreateAccount";

describe("The getOrCreateAccount use case", () => {
  it("returns the existing account for a given auth id", async () => {
    const testAccountId = "test-account-id";
    const testAccount: Partial<IAccountHolderDetails> = { id: testAccountId };
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: {
        getAccountHolderId: jest.fn().mockResolvedValue(testAccountId),
        createAccountHolder: jest.fn(),
        getAccountBeacons: jest.fn(),
        getAccountHolderDetails: jest.fn().mockResolvedValue(testAccount),
      },
      getAccessToken: jest.fn(),
    };
    const context: Partial<GetServerSidePropsContext> = {};
    const functionToTest = await getOrCreateAccount(container as IAppContainer);

    const result = await functionToTest(
      context as BeaconsGetServerSidePropsContext
    );

    expect(result).toEqual(testAccount);
  });

  it("creates a new account holder if one is not found for a given auth id", async () => {
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: {
        getAccountHolderId: jest.fn().mockResolvedValue(null),
        createAccountHolder: jest.fn(),
        getAccountBeacons: jest.fn(),
        getAccountHolderDetails: jest.fn(),
      },
      getAccessToken: jest.fn(),
    };
    const context: Partial<GetServerSidePropsContext> = {};
    const functionToTest = await getOrCreateAccount(container as IAppContainer);

    await functionToTest(context as BeaconsGetServerSidePropsContext);

    expect(
      container.accountHolderApiGateway.createAccountHolder
    ).toHaveBeenCalledTimes(1);
  });
});
