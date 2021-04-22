import axios from "axios";
import { BeaconsApiGateway } from "../../src/gateways/beaconsApiGateway";

jest.mock("axios");

describe("Beacons API Gateway", () => {
  let gateway: BeaconsApiGateway;
  const apiUrl = "http://localhost:8080/spring-api";

  beforeEach(() => {
    process.env.API_URL = apiUrl;
    gateway = new BeaconsApiGateway();
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

    it("should return true if it posted the entity successfuly", async () => {
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
      expect((axios as any).post).toHaveBeenLastCalledWith(expectedUrl, json);
    });
  });
});
