import { MaritimePleasureVessel } from "./types";

export interface IFieldValidator {
  validate(value: string): IFieldValidationResponse;
}

export interface IFieldValidationResponse {
  errorMessages: string[];
  valid: boolean;
  invalid: boolean;
}

export interface FieldRule {
  errorMessage: string;
  predicateFn: (valueToValidate: string) => boolean;
}

export abstract class FieldValidator implements IFieldValidator {
  protected _rules: FieldRule[];

  validate(value: string): IFieldValidationResponse {
    return {
      valid: this.isValid(value),
      invalid: !this.isValid(value),
      errorMessages: this.errorMessages(value),
    };
  }

  static valueViolatesRule(value: string, rule: FieldRule): boolean {
    return rule.predicateFn(value);
  }

  private isValid(value: string): boolean {
    return !this._rules.some((rule) =>
      FieldValidator.valueViolatesRule(value, rule)
    );
  }

  private errorMessages(value: string): string[] {
    return this._rules
      .filter((rule) => FieldValidator.valueViolatesRule(value, rule))
      .map((rule) => rule.errorMessage);
  }
}

export class BeaconModelValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Beacon model is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class BeaconManufacturerValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Beacon manufacturer is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class BeaconHexIdValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Beacon HEX ID must be exactly 15 characters",
        predicateFn: (value) => value.length !== 15,
      },
    ];
  }
}

export class MoreVesselDetailsValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Vessel details is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class MaritimePleasureVesselUseValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Maritime pleasure use is a required field",
        predicateFn: (value) => value.length === 0,
      },
      {
        errorMessage:
          "Value is not a recognised type of maritime pleasure vessel",
        predicateFn: (value) =>
          value.length !== 0 &&
          !Object.values(MaritimePleasureVessel).includes(
            value as MaritimePleasureVessel
          ),
      },
    ];
  }
}

export class OtherPleasureVesselTextValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Other pleasure vessel text is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export const fieldValidatorLookup = {
  manufacturer: new BeaconManufacturerValidator(),
  model: new BeaconModelValidator(),
  hexId: new BeaconHexIdValidator(),
  moreVesselDetails: new MoreVesselDetailsValidator(),
  maritimePleasureVesselUse: new MaritimePleasureVesselUseValidator(),
  otherPleasureVesselText: new OtherPleasureVesselTextValidator(),
};
