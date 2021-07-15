import { FormCacheFactory } from "../lib/formCache";
import { Registration } from "../lib/registration/registration";
import { IRegistration } from "../lib/registration/types";
import { CachedRegistrationGateway } from "./CachedRegistrationGateway";

export class RedisCachedRegistrationGateway
  implements CachedRegistrationGateway
{
  public async deleteUse(
    submissionId: string,
    useIndex: number
  ): Promise<void> {
    const cache = FormCacheFactory.getCache();

    const registration: IRegistration = (
      await cache.get(submissionId)
    ).getRegistration();

    // console.log("sId: " + submissionId);
    //
    // console.log("1: " + registration.uses);

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useIndex),
    };

    // console.log("2: " + registrationMinusDeletedUse.uses);

    await cache.set(
      submissionId,
      new Registration(registrationMinusDeletedUse)
    );
  }
}
