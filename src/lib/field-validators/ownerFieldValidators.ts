import { FieldValidator } from "../fieldValidator";

export class AddressLine1Validator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Building number and street is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class TownOrCityValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Town or city is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export const ownerFieldValidatorLookup = {
  beaconOwnerAddressLine1: new AddressLine1Validator(),
  beaconOwnerTownOrCity: new TownOrCityValidator(),
};
