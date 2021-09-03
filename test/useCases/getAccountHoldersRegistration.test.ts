import { v4 } from "uuid";
import { Registration } from "../../src/entities/Registration";
import { AccountHolderGateway } from "../../src/gateways/interfaces/AccountHolderGateway";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getAccountHoldersRegistration } from "../../src/useCases/getAccountHoldersRegistration";

describe("getAccountHoldersRegistration", () => {
  it("returns a registration that matches the registration and account holder id", async () => {
    const registrationId = v4();
    const accountHolderId = v4();
    const expectedRegistration: Partial<Registration> = {
      id: registrationId,
      accountHolderId: accountHolderId,
      uses: [],
    };
    const gateway: Partial<AccountHolderGateway> = {
      getAccountBeacons: jest.fn().mockResolvedValue([expectedRegistration]),
    };
    const container: Partial<IAppContainer> = {
      accountHolderGateway: gateway as AccountHolderGateway,
    };

    const registration = await getAccountHoldersRegistration(
      container as IAppContainer
    )(registrationId, accountHolderId);

    expect(registration.id).toBe(expectedRegistration.id);
    expect(registration.accountHolderId).toBe(
      expectedRegistration.accountHolderId
    );
  });
});

// getAccountHoldersRegistration = (accountHolderId, registrationid) => {
// 1. a registration that the account holder should see is returned
// 2. a registration the account holder should not see is not returned
