import { GetServerSidePropsContext } from "next";
import { IAppContainer } from "../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../src/lib/container";
import { getAccountHolderId } from "../../src/useCases/getAccountHolderId";

describe("The getAccountHolderId use case", () => {
  it("returns the existing account holder id a given auth id", async () => {
    const testId = "test-account-id";
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: {
        getAccountHolderId: jest.fn().mockResolvedValue(testId),
        createAccountHolder: jest.fn(),
        getAccountBeacons: jest.fn(),
        getAccountHolderDetails: jest.fn(),
      },
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      getAccessToken: jest.fn(),
    };
    const context: Partial<GetServerSidePropsContext> = {};
    const functionToTest = await getAccountHolderId(container as IAppContainer);

    const result = await functionToTest(
      context as BeaconsGetServerSidePropsContext
    );

    expect(result).toEqual(testId);
  });

  it("return null if account holder is not found for a given auth id", async () => {
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
    const functionToTest = await getAccountHolderId(container as IAppContainer);

    await functionToTest(context as BeaconsGetServerSidePropsContext);

    expect(
      container.accountHolderApiGateway.getAccountHolderId
    ).toHaveBeenCalledTimes(1);
  });
});
