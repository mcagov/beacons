import { FormCacheFactory } from "../lib/formCache";
import { Registration } from "../lib/registration/registration";

export type CachedRegistrationRetriever = (
  submissionId: string
) => Promise<Registration>;

export const retrieveCachedRegistration = (): CachedRegistrationRetriever => async (
  submissionId: string
) => await FormCacheFactory.getCache().get(submissionId);
