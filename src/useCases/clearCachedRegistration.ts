import { FormCacheFactory } from "../lib/formCache";

export type ClearCachedRegistrationFn = (submissionId: string) => Promise<void>;

export const clearCachedRegistration: ClearCachedRegistrationFn = async (
  submissionId: string
) => await FormCacheFactory.getCache().clear(submissionId);
