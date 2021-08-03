import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { RedisDraftRegistrationGateway } from "../gateways/RedisDraftRegistrationGateway";

export type DeleteCachedUseFn = (
  submissionId: string,
  useIndex: number,
  cachedRegistrationGateway?: DraftRegistrationGateway
) => Promise<void>;

export const deleteCachedUse: DeleteCachedUseFn = async (
  submissionId,
  useIndex,
  cachedRegistrationGateway = new RedisDraftRegistrationGateway()
) => {
  await cachedRegistrationGateway.deleteUse(submissionId, useIndex);
};
