import { NextApiRequest, NextApiResponse } from "next";
import { B2CAuthGateway } from "../../gateways/B2CAuthGateway";
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

  const azureB2CAuthGateway = new B2CAuthGateway();
  const accessToken = await azureB2CAuthGateway.getAccessToken();
  console.log(accessToken);

  if (!accessToken) {
    serviceHealthResponse.message = "Azure B2C login is not responding";
  }

  return serviceHealthResponse;
}
