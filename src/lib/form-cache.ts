export interface IFormCache {
  set(session: string, formData: object): void;
  get(session: string): object;
}

export class FormCacheFactory {
  private static _state: FormCache = null;

  public static getState(): FormCache {
    if (this._state === null) {
      this._state = new FormCache();
    }

    return this._state;
  }
}

class FormCache implements IFormCache {
  private _byId: Record<string, object> = {};

  public set(session: string, formData: object): void {
    this._byId[session] = formData;
  }

  public get(session: string): object {
    return this._byId[session] || {};
  }
}
