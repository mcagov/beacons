import { GetServerSidePropsContext } from "next";
import { IAccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAppContainer } from "../../src/lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../../src/lib/middleware/withContainer";
import { getAccountHolderId } from "../../src/useCases/getAccountHolderId";

describe("The getAccountHolderId use case", () => {
  it("returns the existing account holder id a given auth id", async () => {
    const testId = "test-account-id";
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(testId),
    };
    const container: Partial<IAppContainer> = {
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
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
    const gateway: Partial<IAccountHolderApiGateway> = {
      getAccountHolderId: jest.fn().mockResolvedValue(null),
    };
    const container: Partial<IAppContainer> = {
      getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
      accountHolderApiGateway: gateway as IAccountHolderApiGateway,
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
