import { BeaconSearchItem } from "entities/BeaconSearch";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IComparisonGateway } from "./IComparisonGateway";
import axios, { AxiosRequestConfig } from "axios";
import { applicationConfig } from "config";
import { searchUrl } from "utils/urls";

export class ComparisonGateway implements IComparisonGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getBeaconsFromOpenSearch(): Promise<BeaconSearchItem[]> {
    //     {"preference":"results"}
    // const requestData: RequestInit = {
    //     body : {
    //     query:{match_all:{}},
    //     size:10,
    //     _source:{includes:["*"],excludes:[]},
    //     from:0,
    //     track_total_hits:true
    //     }
    // }

    const config: AxiosRequestConfig = {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    const response = await fetch(
      `${searchUrl(window.location.hostname)}beacon_search/size=10`
    );
    const beacons = response.json();

    console.log(beacons);

    return [];
  }
}
