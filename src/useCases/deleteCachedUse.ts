import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { RedisDraftRegistrationGateway } from "../gateways/RedisDraftRegistrationGateway";

export type DeleteCachedUseFn = (
  submissionId: string,
  useId: number,
  cachedRegistrationGateway?: DraftRegistrationGateway
) => Promise<void>;

export const deleteCachedUse: DeleteCachedUseFn = async (
  submissionId,
  useId,
  cachedRegistrationGateway = new RedisDraftRegistrationGateway()
) => {
  await cachedRegistrationGateway.deleteUse(submissionId, useId);
};
