import { IOwner } from "../entities/IOwner";
import { deepFreeze } from "../utils";

export const ownerFixture: IOwner = deepFreeze<IOwner>({
  id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
  fullName: "Steve Stevington",
  email: "steve@beaconowner.com",
  telephoneNumber: "07872536271",
  addressLine1: "1 Beacon Square",
  addressLine2: "",
  addressLine3: "",
  addressLine4: "",
  townOrCity: "Beaconsfield",
  county: "Yorkshire",
  postcode: "BS8 7NW",
  country: "United Kingdom",
});

export const testOwners: IOwner[] = [ownerFixture];
