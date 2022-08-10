import { NextApiRequest, NextApiResponse } from "next";
import { AadAuthGateway } from "../../../gateways/AadAuthGateway";
import { IServiceHealthResponse } from "./IServiceHealthResponse";

export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({ status: "Ship shape and Bristol fashion" });
};

// use this function above
export async function getB2CServiceHealthResponse(): Promise<IServiceHealthResponse> {
  const serviceHealthResponse: IServiceHealthResponse = {
    statusCode: 200,
    message: "Ok",
  };
  const azureAdAuthGateway = new AadAuthGateway();
  const signedInAccounts = await azureAdAuthGateway.getSignedInAccounts();

  if (!signedInAccounts.length) {
    serviceHealthResponse.statusCode = 401;
    serviceHealthResponse.message = "Azure B2C is not responding";
  }

  return serviceHealthResponse;
}
