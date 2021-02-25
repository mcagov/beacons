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

export class FullNameValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Full name is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class PostcodeValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Postcode is required",
        predicateFn: (value) => value.length === 0,
      },
      {
        errorMessage: "Postcode must be a valid UK postcode",
        predicateFn: (value) => value.length > 0 && !isPostcodeValid(value),
      },
    ];
  }
}

const isPostcodeValid = (postcode) => {
  // TODO Consider call to postcode validation service, e.g. postcodes.io, here
  // Regex matching UK postcodes is problematic
  // https://stackoverflow.com/a/51885364
  const postcodeRegex = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;
  return postcode.match(postcodeRegex);
};

export class EmailValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Email must be valid",
        predicateFn: (value) => value.length > 0 && !isEmailValid(value),
      },
    ];
  }
}

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return email.match(emailRegex);
};

export const ownerFieldValidatorLookup = {
  beaconOwnerAddressLine1: new AddressLine1Validator(),
  beaconOwnerTownOrCity: new TownOrCityValidator(),
  beaconOwnerPostcode: new PostcodeValidator(),
  beaconOwnerEmail: new EmailValidator(),
  beaconOwnerFullName: new FullNameValidator(),
};
