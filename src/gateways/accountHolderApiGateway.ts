import axios, { AxiosResponse } from "axios";
import { IAccountHolderIdResponseBody } from "../lib/accountHolder/accountHolderIdResponseBody";

export class AccountHolderApiGateway {
  private readonly apiUrl: string;
  private readonly accountHolderIdEndpoint = "account-holder/auth-id";

  constructor() {
    this.apiUrl = process.env.API_URL;
  }

  public async getAccountHolderId(
    authId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderIdEndpoint}/${authId}`;
    var response = await axios.get<
      any,
      AxiosResponse<IAccountHolderIdResponseBody>
    >(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.id;
  }
}
