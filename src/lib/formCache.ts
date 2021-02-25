import { Beacon, BeaconIntent, Vessel } from "./types";

// Convenience type
export type CacheEntry = Partial<Beacon & Vessel> & {
  beaconIntent?: BeaconIntent;
};

export interface IFormCache {
  update(id: string, formData?: CacheEntry): void;

  get(id: string): CacheEntry;
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
  private _byId: Record<string, CacheEntry> = {};

  public update(id: string, formData: CacheEntry = {}): void {
    this._byId[id] = this._byId[id] || {};
    Object.assign(this._byId[id], formData);
  }

  public get(id: string): CacheEntry {
    return this._byId[id] || {};
  }
}
