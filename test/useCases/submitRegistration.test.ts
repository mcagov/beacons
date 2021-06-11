import { IAppContainer } from "../../src/lib/appContainer";
import { submitRegistration } from "../../src/useCases/submitRegistration";

describe("submitRegistration()", () => {
  let container: Partial<IAppContainer>;
  const mockRegistration = {
    serialiseToAPI: jest.fn(),
  };
  const mockRetrieveCachedRegistration = jest
    .fn()
    .mockResolvedValue(mockRegistration);
  const mockRetrieveAuthToken = jest.fn();
  const mockSendConfirmationEmail = jest.fn();
  const mockSendRegistration = jest.fn();

  beforeEach(() => {
    container = {
      getRetrieveCachedRegistration: () => mockRetrieveCachedRegistration,
      getRetrieveAccessToken: () => mockRetrieveAuthToken,
      getSendConfirmationEmail: () => mockSendConfirmationEmail,
      getBeaconsApiGateway: () => ({
        sendRegistration: mockSendRegistration,
      }),
    };
  });
  it("requests an access token from the authGateway", async () => {
    await submitRegistration(container as IAppContainer)("submissionId");

    expect(mockRetrieveAuthToken).toHaveBeenCalledTimes(1);
  });
});
