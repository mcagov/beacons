import { CachedRegistrationGateway } from "../gateways/CachedRegistrationGateway";
import { RedisCachedRegistrationGateway } from "../gateways/RedisCachedRegistrationGateway";

export type DeleteCachedUseFn = (
  submissionId: string,
  useIndex: number,
  cachedRegistrationGateway: CachedRegistrationGateway
) => Promise<void>;

export const deleteCachedUse: DeleteCachedUseFn = async (
  submissionId,
  useIndex,
  cachedRegistrationGateway = new RedisCachedRegistrationGateway()
) => {
  await cachedRegistrationGateway.deleteUse(submissionId, useIndex);
};
