import { FormCacheFactory } from "../lib/formCache";
import { Registration } from "../lib/registration/registration";
import { initBeaconUse } from "../lib/registration/registrationInitialisation";
import { IRegistration } from "../lib/registration/types";
import { CachedRegistrationGateway } from "./CachedRegistrationGateway";

export class RedisCachedRegistrationGateway
  implements CachedRegistrationGateway
{
  public async deleteUse(
    submissionId: string,
    useIndex: number
  ): Promise<void> {
    const registration: IRegistration =
      await RedisCachedRegistrationGateway.getRegistration(submissionId);

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useIndex),
    };

    await RedisCachedRegistrationGateway.saveRegistration(
      submissionId,
      new Registration(registrationMinusDeletedUse)
    );
  }

  public async createEmptyUse(submissionId: string): Promise<void> {
    const registration: IRegistration =
      await RedisCachedRegistrationGateway.getRegistration(submissionId);

    const registrationWithNewUse = {
      ...registration,
      uses: [...registration.uses, initBeaconUse()],
    };

    await RedisCachedRegistrationGateway.saveRegistration(
      submissionId,
      new Registration(registrationWithNewUse)
    );
  }

  private static async getRegistration(
    submissionId: string
  ): Promise<IRegistration> {
    return (
      await FormCacheFactory.getCache().get(submissionId)
    ).getRegistration();
  }

  private static async saveRegistration(
    submissionId: string,
    registration: Registration
  ) {
    await FormCacheFactory.getCache().set(submissionId, registration);
  }
}
