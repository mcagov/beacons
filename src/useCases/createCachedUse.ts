import { CachedRegistrationGateway } from "../gateways/CachedRegistrationGateway";
import { RedisCachedRegistrationGateway } from "../gateways/RedisCachedRegistrationGateway";

export type CreateCachedUseFn = (
  submissionId: string,
  useIndex: number,
  cachedRegistrationGateway?: CachedRegistrationGateway
) => Promise<void>;

export const createCachedUse: CreateCachedUseFn = async (
  submissionId,
  useIndex,
  cachedRegistrationGateway = new RedisCachedRegistrationGateway()
) => {
  await cachedRegistrationGateway.createUse(submissionId);
};
