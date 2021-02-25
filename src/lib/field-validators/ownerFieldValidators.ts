import { FieldValidator } from "../fieldValidator";

export class AddressLine1Validator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Address line 1 is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export const ownerFieldValidatorLookup = {
  beaconOwnerAddressLine1: new AddressLine1Validator(),
};
