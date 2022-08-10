import { NextApiRequest, NextApiResponse } from "next";
import { AadAuthGateway } from "../../gateways/AadAuthGateway";
import { IServiceHealthResponse } from "./IServiceHealthResponse";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const serviceHealthResponse = await getB2CServiceHealthResponse();
  res
    .status(serviceHealthResponse.statusCode)
    .json({ status: serviceHealthResponse.message });
};

export async function getB2CServiceHealthResponse(): Promise<IServiceHealthResponse> {
  const serviceHealthResponse: IServiceHealthResponse = {
    statusCode: 200,
    message: "Ok",
  };
  const azureAdAuthGateway = new AadAuthGateway();
  const signedInAccounts = await azureAdAuthGateway.getSignedInAccounts();

  if (signedInAccounts.length === null) {
    serviceHealthResponse.message = "Azure B2C login is not responding";
  }

  return serviceHealthResponse;
}
