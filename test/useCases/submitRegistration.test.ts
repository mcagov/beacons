import { IAppContainer } from "../../src/lib/appContainer";
import { submitRegistration } from "../../src/useCases/submitRegistration";

describe("submitRegistration()", () => {
  let container: Partial<IAppContainer>;
  let mockRegistration;
  let mockRetrieveCachedRegistration;
  const mockRetrieveAuthToken = jest.fn();
  const mockSendConfirmationEmail = jest.fn();
  const mockSendRegistration = jest.fn();

  beforeEach(() => {
    mockRegistration = {
      serialiseToAPI: jest.fn(),
    };

    mockRetrieveCachedRegistration = jest
      .fn()
      .mockResolvedValue(mockRegistration);

    container = {
      getRetrieveCachedRegistration: () => mockRetrieveCachedRegistration,
      getRetrieveAccessToken: () => mockRetrieveAuthToken,
      getSendConfirmationEmail: () => mockSendConfirmationEmail,
      getBeaconsApiGateway: () => ({
        sendRegistration: mockSendRegistration,
      }),
    };
  });

  afterEach(() => jest.resetAllMocks());

  it("requests an access token from the authGateway", async () => {
    await submitRegistration(container as IAppContainer)("submissionId");

    expect(mockRetrieveAuthToken).toHaveBeenCalledTimes(1);
  });

  it("attempts to send the registration to the beacons API", async () => {
    await submitRegistration(container as IAppContainer)("submissionId");

    expect(mockSendRegistration).toHaveBeenCalledTimes(1);
  });
});
