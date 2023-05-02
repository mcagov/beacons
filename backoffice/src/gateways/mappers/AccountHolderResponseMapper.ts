import { IAccountHolder } from "../../entities/IAccountHolder";
import { AccountHolderRegistrationResponse } from "./IRegistrationResponse";

export interface IAccountHolderResponseMapper {
  map: (
    accountHolderApiResponse: AccountHolderRegistrationResponse
  ) => IAccountHolder;
}

export class AccountHolderResponseMapper
  implements IAccountHolderResponseMapper
{
  public map(accountHolder: AccountHolderRegistrationResponse): IAccountHolder {
    return {
      id: accountHolder.id,
      fullName: accountHolder.attributes.fullName || "",
      email: accountHolder.attributes.email || "",
      telephoneNumber: accountHolder.attributes.telephoneNumber || "",
      alternativeTelephoneNumber:
        accountHolder.attributes.alternativeTelephoneNumber || "",
      addressLine1: accountHolder.attributes.addressLine1 || "",
      addressLine2: accountHolder.attributes.addressLine2 || "",
      addressLine3: accountHolder.attributes.addressLine3 || "",
      addressLine4: accountHolder.attributes.addressLine4 || "",
      townOrCity: accountHolder.attributes.townOrCity || "",
      county: accountHolder.attributes.county || "",
      postcode: accountHolder.attributes.postcode || "",
      country: accountHolder.attributes.country || "",
    };
  }
}
