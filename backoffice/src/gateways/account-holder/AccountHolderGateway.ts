import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "config";
import { IBeacon } from "entities/IBeacon";
import { logToServer } from "../../utils/logger";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IAccountHolderGateway } from "./IAccountHolderGateway";

export class AccountHolderGateway implements IAccountHolderGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }
  public async getAccountHolder(
    accountHolderId: string
  ): Promise<IAccountHolder> {
    try {
      console.log(
        `Calling... http://localhost:8080/spring-api//account-holder/${accountHolderId}`
      );
      const response = await this._makeGetRequest(
        `/account-holder/${accountHolderId}`
      );
      console.log("response:");
      console.log(response.data);
      // return this._accountHolderResponseMapper.map(response.data);
      const accountHolderResponse = response.data.data;

      const accountHolder = {
        id: accountHolderResponse.id,
        fullName: accountHolderResponse.attributes.fullName || "",
        email: accountHolderResponse.attributes.email || "",
        telephoneNumber: accountHolderResponse.attributes.telephoneNumber || "",
        alternativeTelephoneNumber:
          accountHolderResponse.attributes.alternativeTelephoneNumber || "",
        addressLine1: accountHolderResponse.attributes.addressLine1 || "",
        addressLine2: accountHolderResponse.attributes.addressLine2 || "",
        addressLine3: accountHolderResponse.attributes.addressLine3 || "",
        addressLine4: accountHolderResponse.attributes.addressLine4 || "",
        townOrCity: accountHolderResponse.attributes.townOrCity || "",
        county: accountHolderResponse.attributes.county || "",
        postcode: accountHolderResponse.attributes.postcode || "",
        country: accountHolderResponse.attributes.country || "",
      };

      console.log(accountHolder);
      return accountHolder;
    } catch (e) {
      throw e;
    }
  }

  public async getBeaconsForAccountHolderId(
    accountHolderId: string
  ): Promise<IBeacon[]> {
    try {
      const response = await this._makeGetRequest(
        `/account-holder/${accountHolderId}/beacons`
      );

      const beacons = response.data.data;
      console.log("ah beacons response:");
      console.log(response.data);

      return [];
    } catch (e) {
      throw e;
    }
  }

  private async _makeGetRequest(path: string): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.get(`${applicationConfig.apiUrl}${path}`, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
