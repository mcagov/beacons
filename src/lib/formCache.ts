import Redis from "ioredis";
import JSONCache from "redis-json";
import { Registration } from "../entities/Registration";
import { DeprecatedRegistration } from "./deprecatedRegistration/DeprecatedRegistration";

// Convenience type
export type FormSubmission = Record<string, any>;

export interface IFormCache {
  update(id: string, formData?: FormSubmission): Promise<void>;

  set(id: string, registration: DeprecatedRegistration): Promise<void>;

  get(id: string): Promise<DeprecatedRegistration>;

  clear(id: string): Promise<void>;
}

export class FormCacheFactory {
  private static _state: FormCache = null;

  public static getCache(): FormCache {
    if (this._state === null) {
      this._state = new FormCache();
    }

    return this._state;
  }
}

class FormCache implements IFormCache {
  private _byIdToRegistration: Record<string, DeprecatedRegistration> = {};
  private cache = new JSONCache<Registration>(new Redis(process.env.REDIS_URI));

  public async update(
    id: string,
    formData: FormSubmission = {}
  ): Promise<void> {
    const registration: DeprecatedRegistration =
      await this._safeGetRegistration(id);
    registration.update(formData);
    await this.cache.set(id, registration.getRegistration());
  }

  public async get(id: string): Promise<DeprecatedRegistration> {
    return await this._safeGetRegistration(id);
  }

  public async clear(id: string): Promise<void> {
    await this.cache.del(id);
    delete this._byIdToRegistration[id];
  }

  public async set(id: string, registration: DeprecatedRegistration) {
    await this.cache.set(id, registration.getRegistration());
  }

  private async _safeGetRegistration(
    id: string
  ): Promise<DeprecatedRegistration> {
    const registrationData: Registration = (await this.cache.get(
      id
    )) as Registration;

    if (registrationData) {
      return new DeprecatedRegistration(registrationData);
    } else {
      const registration = new DeprecatedRegistration();
      await this.cache.set(id, registration.getRegistration());
      return registration;
    }
  }
}
