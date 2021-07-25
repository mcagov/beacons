import Redis from "ioredis";
import JSONCache from "redis-json";
import { DraftRegistration } from "../entities/DraftRegistration";
import { Registration } from "../lib/registration/registration";
import { initBeaconUse } from "../lib/registration/registrationInitialisation";
import { IRegistration } from "../lib/registration/types";
import { DraftRegistrationGateway } from "./DraftRegistrationGateway";

export class RedisDraftRegistrationGateway implements DraftRegistrationGateway {
  private cache = new JSONCache<DraftRegistration>(
    new Redis(process.env.REDIS_URI)
  );

  public async deleteUse(
    submissionId: string,
    useIndex: number
  ): Promise<void> {
    const registration: IRegistration = await this.read(submissionId);

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useIndex),
    };

    await RedisCachedRegistrationGateway.saveRegistration(
      submissionId,
      new Registration(registrationMinusDeletedUse)
    );
  }

  public async read(id: string): Promise<DraftRegistration> {
    return await this.cache.get(id);
  }

  public async update(
    id: string,
    draftRegistration: DraftRegistration
  ): Promise<void> {
    await this.cache.set(id, draftRegistration);
  }

  public async createEmptyUse(submissionId: string): Promise<void> {
    const registration: IRegistration =
      await RedisCachedRegistrationGateway.getRegistration(submissionId);

    const registrationWithNewUse = {
      ...registration,
      uses: [...registration.uses, initBeaconUse()],
    };

    await this.update(
      submissionId,
      new Registration(registrationWithNewUse).getRegistration()
    );
  }
}
