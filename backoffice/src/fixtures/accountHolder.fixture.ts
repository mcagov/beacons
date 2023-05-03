import { deepFreeze } from "../utils/utils";
import { IAccountHolder } from "../entities/IAccountHolder";

export const accountHolderFixture: IAccountHolder = deepFreeze<IAccountHolder>({
  id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a8",
  fullName: "Steve Stevington",
  email: "steve@beaconowner.com",
  telephoneNumber: "07872536271",
  alternativeTelephoneNumber: "07543889534",
  addressLine1: "1 Beacon Square",
  addressLine2: "",
  addressLine3: "",
  addressLine4: "",
  townOrCity: "Beaconsfield",
  county: "Yorkshire",
  postcode: "BS8 7NW",
  country: "United Kingdom",
  createdDate: "02/05/2023",
  lastModifiedDate: "03/05/2023",
});

export const testAccountHolder: IAccountHolder = accountHolderFixture;
