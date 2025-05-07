import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { RedisDraftRegistrationGateway } from "../gateways/RedisDraftRegistrationGateway";

export type MakeCachedUseMainFn = (
  submissionId: string,
  useId: number,
  cachedRegistrationGateway?: DraftRegistrationGateway
) => Promise<void>;

export const makeCachedUseMain: MakeCachedUseMainFn = async (
  submissionId,
  useId,
  cachedRegistrationGateway = new RedisDraftRegistrationGateway()
) => {
  await cachedRegistrationGateway.makeUseMain(submissionId, useId);
};
