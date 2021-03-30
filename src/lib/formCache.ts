/* eslint-disable @typescript-eslint/no-explicit-any */
import { Registration } from "./registration/registration";

// Convenience type
export type FormSubmission = Record<string, any>;

export interface IFormCache {
  update(id: string, formData?: FormSubmission): void;

  get(id: string): Registration;
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

  public update(id: string, formData: FormSubmission = {}): void {
    const registration: Registration = this._safeGetRegistration(id);
    registration.update(formData);
  }

  public get(id: string): Registration {
    return this._safeGetRegistration(id);
  }

  private _safeGetRegistration(id: string): Registration {
    this._byIdToRegistration[id] =
      this._byIdToRegistration[id] || new Registration();

    return this._byIdToRegistration[id];
  }
}
