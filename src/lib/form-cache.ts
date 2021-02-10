import { Beacon } from "./types";

// Convenience type
export type BeaconCacheEntry = Partial<Beacon>;

export interface IFormCache {
  update(id: string, formData?: BeaconCacheEntry): void;

  get(id: string): BeaconCacheEntry;
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
  private _byId: Record<string, BeaconCacheEntry> = {};

  public update(id: string, formData: BeaconCacheEntry = {}): void {
    this._byId[id] = this._byId[id] || {};
    Object.assign(this._byId[id], formData);
  }

  public get(id: string): BeaconCacheEntry {
    return this._byId[id] || {};
  }
}
