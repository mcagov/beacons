import { IAccountHolderDetails } from "../../src/entities/accountHolderDetails";
import { deepFreeze } from "../utils/deepFreeze";

export const accountHolderFixture: IAccountHolderDetails = deepFreeze({
  id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
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
});
