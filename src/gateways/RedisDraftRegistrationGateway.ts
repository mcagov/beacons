import Redis from "ioredis";
import JSONCache from "redis-json";
import { DraftRegistration } from "../entities/DraftRegistration";
import { FormCacheFactory } from "../lib/formCache";
import { Registration } from "../lib/registration/registration";
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
    const cache = FormCacheFactory.getCache();

    const registration: IRegistration = (
      await cache.get(submissionId)
    ).getRegistration();

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useIndex),
    };

    await cache.set(
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
}
