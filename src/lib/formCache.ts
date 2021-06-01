import Redis from "ioredis";
import JSONCache from "redis-json";
import { Registration } from "./registration/registration";
import { IRegistration } from "./registration/types";

// Convenience type
export type FormSubmission = Record<string, any>;

export interface IFormCache {
  update(id: string, formData?: FormSubmission): void;

  get(id: string): Promise<Registration>;

  clear(id: string): void;
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
  private _byIdToRegistration: Record<string, Registration> = {};
  private cache = new JSONCache<IRegistration>(new Redis());

  public async update(
    id: string,
    formData: FormSubmission = {}
  ): Promise<void> {
    const registration: Registration = await this._safeGetRegistration(id);
    registration.update(formData);
  }

  public async get(id: string): Promise<Registration> {
    return await this._safeGetRegistration(id);
  }

  public clear(id: string): void {
    delete this._byIdToRegistration[id];
  }

  private async _safeGetRegistration(id: string): Promise<Registration> {
    const registrationData: IRegistration = (await this.cache.get(
      id
    )) as IRegistration;

    if (registrationData) {
      return new Registration(registrationData);
    } else {
      const registration = new Registration();
      await this.cache.set(id, registration.getRegistration());
      return registration;
    }
  }
}
