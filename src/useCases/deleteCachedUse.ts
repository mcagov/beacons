import { CachedRegistrationGateway } from "../gateways/CachedRegistrationGateway";

export type DeleteCachedUseFn = (
  submissionId: string,
  useIndex: number,
  cachedRegistrationGateway: CachedRegistrationGateway
) => Promise<void>;

export const deleteCachedUse: DeleteCachedUseFn = async (
  submissionId,
  useIndex,
  cachedRegistrationGateway
) => {
  await cachedRegistrationGateway.deleteUse(submissionId, useIndex);
};
