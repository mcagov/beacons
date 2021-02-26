import { FieldValidator } from "../fieldValidator";
import { MaritimePleasureVessel } from "../types";
import { beaconFieldValidatorLookup } from "./beaconFieldValidators";
import { emergencyContactFieldValidatorLookup } from "./emergencyContactFieldValidators";
import { ownerFieldValidatorLookup } from "./ownerFieldValidators";
import { vesselFieldValidatorLookup } from "./vesselFieldValidators";

export class MoreVesselDetailsValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Vessel details is a required field",
        hasErrorFn: (value) => value.length === 0,
      },
      {
        errorMessage: "Vessel details must be less than 250 characters",
        hasErrorFn: (value) => value.length > 250,
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
        hasErrorFn: (value) => value.length === 0,
      },
      {
        errorMessage:
          "Value is not a recognised type of maritime pleasure vessel",
        hasErrorFn: (value) =>
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
      // TODO Conditional rule: if OtherPleasureVessel is selected, field is required
      // {
      //   errorMessage: "Other pleasure vessel text is a required field",
      //   predicateFn: (value) => value.length === 0,
      // },
    ];
  }
}

export const fieldValidatorLookup = {
  ...beaconFieldValidatorLookup,
  moreVesselDetails: new MoreVesselDetailsValidator(),
  maritimePleasureVesselUse: new MaritimePleasureVesselUseValidator(),
  otherPleasureVesselText: new OtherPleasureVesselTextValidator(),
  ...vesselFieldValidatorLookup,
  ...ownerFieldValidatorLookup,
  ...emergencyContactFieldValidatorLookup,
};
