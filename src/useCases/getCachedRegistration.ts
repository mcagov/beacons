import { FormCacheFactory } from "../lib/formCache";
import { IRegistration } from "../lib/registration/types";

export type GetCachedRegistrationFn = (
  submissionId: string
) => Promise<IRegistration>;

export const getCachedRegistration: GetCachedRegistrationFn = async (
  submissionId: string
): Promise<IRegistration> =>
  (await FormCacheFactory.getCache().get(submissionId)).getRegistration();
