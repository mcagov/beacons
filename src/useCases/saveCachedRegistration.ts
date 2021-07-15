import { FormCacheFactory } from "../lib/formCache";
import { Registration } from "../lib/registration/registration";

export type SaveCachedRegistrationFn = (
  submissionId: string,
  registration: Registration
) => Promise<void>;

export const saveCachedRegistration: SaveCachedRegistrationFn = async (
  submissionId: string,
  registration: Registration
): Promise<void> =>
  await FormCacheFactory.getCache().set(submissionId, registration);
