import { IAccountHolderDetailsResponse } from "../../src/gateways/mappers/IAccountHolderDetailsResponse";
import { IAccountHolderIdResponseBody } from "../../src/gateways/mappers/IAccountHolderIdResponseBody";
import { deepFreeze } from "../utils/deepFreeze";

export const accountIdFromAuthIdResponseJson: IAccountHolderIdResponseBody =
  deepFreeze({
    id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
  });

export const accountDetailsResponseJson: IAccountHolderDetailsResponse =
  deepFreeze({
    data: {
      type: "accountHolder",
      id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
      attributes: {
        authId: "replace-with-test-auth-id",
        email: "testy@mctestface.com",
        fullName: "Tesy McTestface",
        telephoneNumber: "01178 657123",
        alternativeTelephoneNumber: "",
        addressLine1: "Flat 42",
        addressLine2: "Testington Towers",
        addressLine3: "",
        addressLine4: "",
        townOrCity: "Testville",
        postcode: "TS1 23A",
        county: "Testershire",
      },
      relationships: {},
    },
  });
