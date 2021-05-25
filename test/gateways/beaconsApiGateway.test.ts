import axios from "axios";
import { BeaconsApiGateway } from "../../src/gateways/beaconsApiGateway";

jest.mock("axios");

describe("Beacons API Gateway", () => {
  let gateway: BeaconsApiGateway;

  beforeEach(() => {
    gateway = new BeaconsApiGateway();
  });

  describe("Posting an entity", () => {
    let endpoint;
    let json;
    let token;

    beforeEach(() => {
      endpoint = "registrations/register";
      json = { model: "ASOS" };
      token = "mock_access_token";
    });

    it("should return true if it posted the entity successfully", async () => {
      const expected = await gateway.sendRegistration(json, token);
      expect(expected).toBe(true);
    });

    it("should return false if the request is unsuccessful", async () => {
      (axios as any).post.mockImplementation(() => {
        throw new Error();
      });
      const expected = await gateway.sendRegistration(json, token);
      expect(expected).toBe(false);
    });

    it("should send the JSON to the correct url", async () => {
      const expectedUrl = `${process.env.API_URL}/${endpoint}`;
      await gateway.sendRegistration(json, token);
      expect((axios as any).post).toHaveBeenLastCalledWith(
        expectedUrl,
        json,
        expect.anything()
      );
    });
  });
});
