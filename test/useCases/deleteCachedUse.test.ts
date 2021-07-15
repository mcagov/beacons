import { CachedRegistrationGateway } from "../../src/gateways/CachedRegistrationGateway";
import { deleteCachedUse } from "../../src/useCases/deleteCachedUse";

describe("deleteCachedUse", () => {
  it("calls the injected CachedRegistrationGateway to delete the cached use", () => {
    const submissionId = "test-submissionId";
    const useIndex = 0;
    const cachedRegistrationGateway: CachedRegistrationGateway = {
      deleteUse: jest.fn(),
    };

    deleteCachedUse(submissionId, useIndex, cachedRegistrationGateway);

    expect(cachedRegistrationGateway.deleteUse).toHaveBeenCalledWith(
      submissionId,
      useIndex
    );
  });
});
