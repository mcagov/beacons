import Redis from "ioredis";
import JSONCache from "redis-json";
import { DraftRegistration } from "../entities/DraftRegistration";
import { DraftRegistrationGateway } from "./DraftRegistrationGateway";

export class RedisDraftRegistrationGateway implements DraftRegistrationGateway {
  private cache = new JSONCache<DraftRegistration>(
    new Redis(process.env.REDIS_URI)
  );

  public async deleteUse(
    submissionId: string,
    useIndex: number
  ): Promise<void> {
    const registration: DraftRegistration = await this.read(submissionId);

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useIndex),
    };

    await this.update(submissionId, registrationMinusDeletedUse);
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
    const registration: DraftRegistration = await this.read(submissionId);

    const registrationWithNewUse = {
      ...registration,
      uses: [...(registration?.uses || []), {}],
    };

    await this.update(submissionId, registrationWithNewUse);
  }
}
