import { CachedRegistrationGateway } from "../../src/gateways/CachedRegistrationGateway";
import { deleteCachedUse } from "../../src/useCases/deleteCachedUse";

describe("deleteCachedUse", () => {
  it("calls the injected CachedRegistrationGateway to delete the cached use", async () => {
    const submissionId = "test-submissionId";
    const useIndex = 0;
    const cachedRegistrationGateway: CachedRegistrationGateway = {
      deleteUse: jest.fn(),
    };

    await deleteCachedUse(submissionId, useIndex, cachedRegistrationGateway);

    expect(cachedRegistrationGateway.deleteUse).toHaveBeenCalledWith(
      submissionId,
      useIndex
    );
  });

  it("throws if there is an error during deletion", async () => {
    const submissionId = "test-submissionId";
    const useIndex = 0;
    const cachedRegistrationGateway: CachedRegistrationGateway = {
      deleteUse: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    };

    await expect(
      deleteCachedUse(submissionId, useIndex, cachedRegistrationGateway)
    ).rejects.toThrow();
  });
});
