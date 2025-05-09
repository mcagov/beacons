import Redis from "ioredis";
import JSONCache from "redis-json";
import { DraftRegistration } from "../entities/DraftRegistration";
import { DraftRegistrationGateway } from "./interfaces/DraftRegistrationGateway";
import { isValidUse } from "../lib/helpers/isValidUse";

export class RedisDraftRegistrationGateway implements DraftRegistrationGateway {
  private cache = new JSONCache<DraftRegistration>(
    new Redis(process.env.REDIS_URI),
  );
  private static instance: DraftRegistrationGateway;

  static getGateway(): DraftRegistrationGateway {
    if (!RedisDraftRegistrationGateway.instance) {
      RedisDraftRegistrationGateway.instance =
        new RedisDraftRegistrationGateway();
    }

    return RedisDraftRegistrationGateway.instance;
  }

  public async read(id: string): Promise<DraftRegistration> {
    return (await this.cache.get(id)) as DraftRegistration;
  }

  public async update(
    id: string,
    draftRegistration: DraftRegistration,
  ): Promise<void> {
    await this.cache.set(id, draftRegistration);
  }

  public async delete(id: string): Promise<void> {
    await this.cache.del(id);
  }

  public async createEmptyUse(submissionId: string): Promise<void> {
    const registration: DraftRegistration = await this.read(submissionId);

    const registrationWithNewUse = {
      ...registration,
      uses: [
        ...(registration?.uses || []),
        {
          environment: "",
          purpose: "",
          activity: "",
          moreDetails: "",
        },
      ],
    };

    await this.update(submissionId, registrationWithNewUse);
  }

  public async deleteUse(submissionId: string, useId: number): Promise<void> {
    const registration: DraftRegistration = await this.read(submissionId);

    const registrationMinusDeletedUse = {
      ...registration,
      uses: registration.uses.filter((use, i) => i !== useId),
    };

    await this.update(submissionId, registrationMinusDeletedUse);
  }

  public async removeInvalidUse(submissionId: string): Promise<void> {
    const registration: DraftRegistration = await this.read(submissionId);

    const registrationMinusInvalidUse = {
      ...registration,
      uses: registration?.uses.filter((use) => isValidUse(use)),
    };

    await this.update(submissionId, registrationMinusInvalidUse);
  }

  public async makeUseMain(submissionId: string, useId: number): Promise<void> {
    const registration: DraftRegistration = await this.read(submissionId);

    const updatedUses = {
      ...registration,
      uses: registration.uses.map((use, i) => {
        return { ...use, mainUse: i === useId };
      }),
    };

    await this.update(submissionId, updatedUses);
  }
}
