import { CachedRegistrationGateway } from "../gateways/CachedRegistrationGateway";
import { RedisCachedRegistrationGateway } from "../gateways/RedisCachedRegistrationGateway";

export type AddNewUseToDraftRegistrationFn = (
  submissionId: string,
  cachedRegistrationGateway?: CachedRegistrationGateway
) => Promise<void>;

export const addNewUseToDraftRegistration: AddNewUseToDraftRegistrationFn =
  async (
    submissionId,
    cachedRegistrationGateway = new RedisCachedRegistrationGateway()
  ) => {
    await cachedRegistrationGateway.createEmptyUse(submissionId);
  };
