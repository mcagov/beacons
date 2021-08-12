import { AccountHolder } from "../../src/entities/AccountHolder";
import { deepFreeze } from "../deepFreeze";

export const accountHolderFixture: AccountHolder = deepFreeze({
  id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
  authId: "replace-with-test-auth-id",
  email: "testy@mctestface.com",
  fullName: "Testy McTestface",
  telephoneNumber: "+447713812657",
  alternativeTelephoneNumber: "",
  addressLine1: "Flat 42",
  addressLine2: "Testington Towers",
  addressLine3: "",
  addressLine4: "",
  townOrCity: "Testville",
  postcode: "TS1 5AE",
  county: "Testershire",
});
