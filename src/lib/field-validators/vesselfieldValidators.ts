import { FieldValidator } from "../fieldValidator";

export class VesselMaxCapacityValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Maximum number of persons onboard is a required field",
        predicateFn: (value) => value.length === 0,
      },
      {
        errorMessage:
          "Maximum number of persons onboard must be a whole number",
        predicateFn: (value) => value.match(/\D+/) !== null,
      },
    ];
  }
}

export class VesselAreaOfOperationValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Typical area of operation has too many characters",
        predicateFn: (value) => value.length > 250,
      },
    ];
  }
}

export class VesselBeaconLocationValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Where the beacon is kept has too many characters",
        predicateFn: (value) => value.length > 100,
      },
    ];
  }
}

export const vesselFieldValidatorLookup = {
  maxCapacity: new VesselMaxCapacityValidator(),
  areaOfOperation: new VesselAreaOfOperationValidator(),
  beaconLocation: new VesselBeaconLocationValidator(),
};
