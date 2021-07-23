import { DraftRegistrationGateway } from "../../src/gateways/DraftRegistrationGateway";
import { deleteCachedUse } from "../../src/useCases/deleteCachedUse";

describe("deleteCachedUse", () => {
  it("calls the injected DraftRegistrationGateway to delete the cached use", async () => {
    const submissionId = "test-submissionId";
    const useIndex = 0;
    const cachedRegistrationGateway: DraftRegistrationGateway = {
      deleteUse: jest.fn(),
    } as any;

    await deleteCachedUse(submissionId, useIndex, cachedRegistrationGateway);

    expect(cachedRegistrationGateway.deleteUse).toHaveBeenCalledWith(
      submissionId,
      useIndex
    );
  });

  it("throws if there is an error during deletion", async () => {
    const submissionId = "test-submissionId";
    const useIndex = 0;
    const cachedRegistrationGateway: DraftRegistrationGateway = {
      deleteUse: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    } as any;

    await expect(
      deleteCachedUse(submissionId, useIndex, cachedRegistrationGateway)
    ).rejects.toThrow();
  });
});
