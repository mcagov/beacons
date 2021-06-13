import { FormCacheFactory } from "../lib/formCache";

export type ClearCachedRegistration = (submissionId: string) => Promise<void>;

export const clearCachedRegistration: ClearCachedRegistration = async (
  submissionId: string
) => await FormCacheFactory.getCache().clear(submissionId);
