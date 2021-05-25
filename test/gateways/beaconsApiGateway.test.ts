import axios from "axios";
import { BeaconsApiGateway } from "../../src/gateways/beaconsApiGateway";
import { IAuthGateway } from "../../src/gateways/IAuthGateway";
import { IRegistrationRequestBody } from "../../src/lib/registration/iRegistrationRequestBody";

jest.mock("axios");

describe("Beacons API Gateway", () => {
  let gateway: BeaconsApiGateway;
  const apiUrl = "http://localhost:8080/spring-api";
  let mockAadAuthGateway: IAuthGateway;

  beforeEach(() => {
    process.env.API_URL = apiUrl;
    mockAadAuthGateway = {
      getAccessToken: jest.fn(),
    };
    gateway = new BeaconsApiGateway(mockAadAuthGateway);
  });

  afterEach(() => {
    process.env.API_URL = undefined;
  });

  describe("Posting an entity", () => {
    let url;
    let json;

    beforeEach(() => {
      url = "registrations/register";
      json = { model: "ASOS" };
    });

    it("should query its auth gateway for a token", async () => {
      await gateway.sendRegistration({} as IRegistrationRequestBody);

      expect(mockAadAuthGateway.getAccessToken).toHaveBeenCalled();
    });

    it("should return true if it posted the entity successfully", async () => {
      const expected = await gateway.sendRegistration(json);
      expect(expected).toBe(true);
    });

    it("should return false if the request is unsuccessful", async () => {
      (axios as any).post.mockImplementation(() => {
        throw new Error();
      });
      const expected = await gateway.sendRegistration(json);
      expect(expected).toBe(false);
    });

    it("should send the JSON to the correct url", async () => {
      const expectedUrl = `${apiUrl}/${url}`;
      await gateway.sendRegistration(json);
      expect((axios as any).post).toHaveBeenLastCalledWith(
        expectedUrl,
        json,
        expect.anything()
      );
    });
  });
});
