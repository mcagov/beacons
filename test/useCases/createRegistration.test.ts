import { CreateRegistration } from "../../src/useCases/createRegistration";

describe("Create Registration Use Case", () => {
  let beaconsGateway;
  let authGateway;
  let accessToken;
  let registration;
  let json;
  let useCase;

  beforeEach(() => {
    json = { model: "ASOS" };
    accessToken = "mock_access_token";
    beaconsGateway = { sendRegistration: jest.fn() };
    authGateway = { getAccessToken: jest.fn().mockResolvedValue(accessToken) };
    registration = { serialiseToAPI: jest.fn().mockImplementation(() => json) };
    useCase = new CreateRegistration(beaconsGateway, authGateway);
  });

  it("should request an access token via the auth gateway", async () => {
    await useCase.execute(registration);

    expect(authGateway.getAccessToken).toHaveBeenCalled();
  });

  it("should post the registration json via the api gateway", async () => {
    await useCase.execute(registration);

    expect(beaconsGateway.sendRegistration).toHaveBeenCalledWith(
      json,
      accessToken
    );
  });

  it("should return true if the request is successful", async () => {
    beaconsGateway.sendRegistration.mockImplementation(() => {
      return false;
    });
    const expected = await useCase.execute(registration);

    expect(expected).toBe(false);
  });

  it("should return false if the request is unsuccessful", async () => {
    beaconsGateway.sendRegistration.mockImplementation(() => {
      return true;
    });
    const expected = await useCase.execute(registration);

    expect(expected).toBe(true);
  });
});
