import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { submitRegistration } from "../../src/useCases/submitRegistration";

describe("submitRegistration()", () => {
  const mockDraftRegistration: DraftRegistration = { model: "ASOS", uses: [] };

  it("attempts to send the registration to the beacons API", async () => {
    const mockSendRegistrationToApi = jest.fn();
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn(),
      beaconsApiGateway: {
        sendRegistration: mockSendRegistrationToApi,
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(mockSendRegistrationToApi).toHaveBeenCalledTimes(1);
  });

  it("sets the registration number before sending to the beacons API", async () => {
    // TODO: Move setting the registration number to the API and delete this test
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn(),
      beaconsApiGateway: {
        sendRegistration: jest.fn(),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(container.beaconGateway.sendRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ referenceNumber: expect.any(String) })
    );
  });

  it("sets the account holder id before sending to the beacons API", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn(),
      beaconsApiGateway: {
        sendRegistration: jest.fn(),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(container.beaconGateway.sendRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ accountHolderId: "accountHolderId" })
    );
  });

  it("account holder id accepts null value without throwing", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn(),
      beaconsApiGateway: {
        sendRegistration: jest.fn(),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    await submitRegistration(container)(mockDraftRegistration, null);

    expect(container.beaconGateway.sendRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ accountHolderId: null })
    );
  });

  it("attempts to send a confirmation email if registration was successful", async () => {
    const email = "beacons@beacons.com";
    const mockSendConfirmationEmail = jest.fn();
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: mockSendConfirmationEmail,
      beaconsApiGateway: {
        sendRegistration: jest.fn().mockResolvedValue(true),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(mockSendConfirmationEmail).toHaveBeenCalledWith(
      expect.anything(),
      email
    );
  });

  it("returns the result when the registration was a success and the email was sent", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn().mockResolvedValue(true),
      beaconsApiGateway: {
        sendRegistration: jest.fn().mockResolvedValue(true),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    const result = await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(result).toStrictEqual({
      beaconRegistered: true,
      confirmationEmailSent: true,
      referenceNumber: expect.any(String),
    });
  });

  it("returns the result when the registration was a success but the email was not sent", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn().mockResolvedValue(false),
      beaconsApiGateway: {
        sendRegistration: jest.fn().mockResolvedValue(true),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    const result = await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(result).toStrictEqual({
      beaconRegistered: true,
      confirmationEmailSent: false,
      referenceNumber: expect.any(String),
    });
  });

  it("returns a registration number when the registration was a success", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn().mockResolvedValue(false),
      beaconsApiGateway: {
        sendRegistration: jest.fn().mockResolvedValue(true),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    const result = await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(result.referenceNumber.length).toBeDefined();
  });

  it("returns an empty registration number when the registration failed", async () => {
    const container: Partial<IAppContainer> = {
      sendConfirmationEmail: jest.fn().mockResolvedValue(false),
      beaconsApiGateway: {
        sendRegistration: jest.fn().mockResolvedValue(false),
      },
      accountHolderApiGateway: {
        getAccountHolderDetails: jest.fn(async () => ({
          email: "beacons@beacons.com",
        })),
      },
    } as any;

    const result = await submitRegistration(container)(
      mockDraftRegistration,
      "accountHolderId"
    );

    expect(result.referenceNumber).toEqual("");
  });
});
