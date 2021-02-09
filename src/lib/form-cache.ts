export interface IFormCache {
  set(session: string, formData: Partial<Beacon>): void;
  get(session: string): Partial<Beacon>;
}

interface Beacon {
  beaconManufacturer: string;
  beaconModel: string;
  beaconHexId: string;
}

// Convenience type
type BeaconCache = Partial<Beacon>;

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
  private _byId: Record<string, BeaconCache> = {};

  public set(session: string, formData: BeaconCache): void {
    this._byId[session] = this._byId[session] || {};
    Object.assign(this._byId[session], formData);
  }

  public get(session: string): BeaconCache {
    return this._byId[session] || {};
  }
}
