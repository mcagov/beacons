import { createClient, RedisClientType } from "redis";
import { DraftRegistration } from "../entities/DraftRegistration";
import { DraftRegistrationGateway } from "./interfaces/DraftRegistrationGateway";
import { isValidUse } from "../lib/helpers/isValidUse";
import logger from "../logger";

export class RedisDraftRegistrationGateway implements DraftRegistrationGateway {
  private static instance: DraftRegistrationGateway;
  private cache: RedisClientType;

  constructor() {
    this.cache = createClient({ url: process.env.REDIS_URI });

    this.cache.on("error", (err) => {
      logger.error("Redis error:", err);
    });

    this.connect().catch((err) => {
      logger.crit("Redis failed to connect on startup:", err);
    });
  }

  private async connect(): Promise<void> {
    if (!this.cache.isOpen) {
      await this.cache.connect();
      logger.debug("Redis connected");
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.cache.isOpen) {
        await this.cache.quit();
        logger.debug("Redis disconnected");
      }
    } catch (err) {
      console.error("Error disconnecting Redis:", err);
    }
  }

  static getGateway(): DraftRegistrationGateway {
    if (!RedisDraftRegistrationGateway.instance) {
      RedisDraftRegistrationGateway.instance =
        new RedisDraftRegistrationGateway();
    }

    return RedisDraftRegistrationGateway.instance;
  }

  public async read(id: string): Promise<DraftRegistration> {
    return (await this.cache.json.get(id)) as DraftRegistration;
  }

  public async update(
    id: string,
    draftRegistration: DraftRegistration,
  ): Promise<void> {
    await this.cache.json.set(id, "$", draftRegistration);
  }

  public async delete(id: string): Promise<void> {
    await this.cache.json.del(id);
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
