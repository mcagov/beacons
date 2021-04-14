import { FormSubmission } from "../formCache";
import { initBeacon, initBeaconUse } from "./registrationInitialisation";
import { IRegistration } from "./types";

type Indexes = {
  useIndex: number;
};

export class Registration {
  private static readonly USES_KEY = "uses";

  public registration: IRegistration;

  constructor() {
    this.registration = initBeacon();
  }

  public getFlattenedRegistration(indexes: Indexes): FormSubmission {
    let flattenedRegistration = { ...this.registration };
    delete flattenedRegistration.uses;

    const useIndex = this._parseUseIndex(indexes.useIndex);
    const use = this.registration.uses[useIndex];
    flattenedRegistration = { ...flattenedRegistration, ...use };

    return flattenedRegistration;
  }

  public getRegistration = (): IRegistration => {
    return this.registration;
  };

  public createUse(): void {
    const use = initBeaconUse();
    this.registration.uses.push(use);
  }

  public update(formData: FormSubmission): void {
    formData = formData || {};
    this._updateBeacon(formData);
    this._updateUse(formData);
  }

  public usesCount(): number {
    return this.registration.uses.length;
  }

  private _updateBeacon(formData: FormSubmission): void {
    Object.keys(formData)
      .filter((key: string) => !(key === Registration.USES_KEY))
      .forEach((key: string) => {
        if (key in this.registration) {
          this.registration[key] = formData[key];
        }
      });
  }

  private _updateUse(formData: FormSubmission): void {
    const useIndex = this._parseUseIndex(formData.useIndex);
    const use = this.registration.uses[useIndex];

    Object.keys(formData).forEach((key: string) => {
      if (key in use) {
        use[key] = formData[key];
      }
    });
  }

  private _parseUseIndex(useIndex = 0): number {
    useIndex = useIndex || 0;
    const beaconUseLength = this.registration.uses.length - 1;
    return Math.min(useIndex, beaconUseLength);
  }
}
