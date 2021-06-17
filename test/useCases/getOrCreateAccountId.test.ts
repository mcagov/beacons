import { GetServerSidePropsContext } from "next";
import { IAppContainer } from "../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../src/lib/container";
import { getOrCreateAccountId } from "../../src/useCases/getOrCreateAccountId";

describe("The getOrCreateAccountId use case", () => {
  it("returns the existing account id", async () => {
    const testAccountId = "test-account-id";
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: {
        getAccountHolderId: jest.fn().mockResolvedValue(testAccountId),
        createAccountHolderId: jest.fn(),
        getAccountBeacons: jest.fn(),
        getAccountHolderDetails: jest.fn(),
      },
      getAccessToken: jest.fn(),
    };
    const context: Partial<GetServerSidePropsContext> = {};
    const functionToTest = await getOrCreateAccountId(
      container as IAppContainer
    );
    const result = await functionToTest(
      context as BeaconsGetServerSidePropsContext
    );
    console.log(result);
    expect(result).toEqual(testAccountId);
  });

  it("calling the create account endpoint if an account-id isn't returned for an auth-id", async () => {
    const testAccountId = "test-account-id";
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: {
        getAccountHolderId: jest.fn().mockResolvedValue(null),
        createAccountHolderId: jest.fn(),
        getAccountBeacons: jest.fn(),
        getAccountHolderDetails: jest.fn(),
      },
      getAccessToken: jest.fn(),
    };

    const context: Partial<GetServerSidePropsContext> = {};
    const functionToTest = await getOrCreateAccountId(
      container as IAppContainer
    );
    const result = await functionToTest(
      context as BeaconsGetServerSidePropsContext
    );
    console.log(result);
    expect(result).toEqual(testAccountId);
  });
});
