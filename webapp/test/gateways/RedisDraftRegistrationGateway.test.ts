import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { RedisDraftRegistrationGateway } from "../../src/gateways/RedisDraftRegistrationGateway";
import JSONCacheMock from "redis-json";
import { ONE_DAY_SECONDS } from "../../src/lib/dateTime";

// Mock external dependencies
jest.mock("ioredis", () => jest.fn());
jest.mock("redis-json", () => jest.fn());

describe("RedisDraftRegistrationGateway", () => {
  let gateway: RedisDraftRegistrationGateway;
  let cacheMock: any;

  const draft: DraftRegistration = {
    id: "123",
    uses: [
      {
        environment: "AVIATION",
        purpose: "PLEASURE",
        activity: "GLIDER",
        moreDetails: "More details of this vessel",
      },
    ],
  };

  beforeEach(() => {
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };
    (JSONCacheMock as jest.Mock).mockImplementation(() => cacheMock);
    gateway = new RedisDraftRegistrationGateway();
  });

  it("should return the same singleton instance from getGateway()", () => {
    const g1 = RedisDraftRegistrationGateway.getGateway();
    const g2 = RedisDraftRegistrationGateway.getGateway();
    expect(g1).toBe(g2);
  });

  describe("read", () => {
    it("should read a draft registration from cache", async () => {
      cacheMock.get.mockResolvedValue(draft);
      const result = await gateway.read("123");
      expect(cacheMock.get).toHaveBeenCalledWith("123");
      expect(result).toEqual(draft);
    });
  });

  describe("update", () => {
    it("should update a draft registration in cache with TTL", async () => {
      await gateway.update("123", draft);
      expect(cacheMock.set).toHaveBeenCalledWith("123", draft, {
        expire: ONE_DAY_SECONDS,
      });
    });
  });

  describe("delete", () => {
    it("should delete a draft registration from cache", async () => {
      await gateway.delete("123");
      expect(cacheMock.del).toHaveBeenCalledWith("123");
    });
  });

  describe("createEmptyUse", () => {
    it("should add an empty use to the draft registration", async () => {
      cacheMock.get.mockResolvedValue(draft);
      await gateway.createEmptyUse("123");

      expect(cacheMock.set).toHaveBeenCalledWith(
        "123",
        {
          ...draft,
          uses: [
            ...draft.uses,
            { environment: "", purpose: "", activity: "", moreDetails: "" },
          ],
        },
        { expire: ONE_DAY_SECONDS },
      );
    });
  });

  describe("deleteUse", () => {
    it("should remove the specified use", async () => {
      cacheMock.get.mockResolvedValue(draft);
      await gateway.deleteUse("123", 0);

      expect(cacheMock.set).toHaveBeenCalledWith(
        "123",
        {
          ...draft,
          uses: [],
        },
        { expire: ONE_DAY_SECONDS },
      );
    });
  });

  describe("removeInvalidUse", () => {
    it("should filter out invalid uses", async () => {
      cacheMock.get.mockResolvedValue({
        ...draft,
        uses: [
          {
            environment: "AVIATION",
            purpose: "PLEASURE",
            activity: "GLIDER",
            moreDetails: "More details of this vessel",
          },
          { environment: "", purpose: "", activity: "", moreDetails: "" },
        ],
      });

      await gateway.removeInvalidUse("123");

      expect(cacheMock.set).toHaveBeenCalledWith(
        "123",
        {
          ...draft,
          uses: [
            {
              environment: "AVIATION",
              purpose: "PLEASURE",
              activity: "GLIDER",
              moreDetails: "More details of this vessel",
            },
          ],
        },
        { expire: ONE_DAY_SECONDS },
      );
    });
  });

  describe("makeUseMain", () => {
    it("should mark the specified use as main", async () => {
      cacheMock.get.mockResolvedValue({
        ...draft,
        uses: [
          {
            environment: "AVIATION",
            purpose: "PLEASURE",
            activity: "GLIDER",
            moreDetails: "More details of this vessel",
          },
          {
            environment: "MARITIME",
            purpose: "COMMERCIAL",
            activity: "SAILING",
            moreDetails: "More details of this vessel",
          },
        ],
      });

      await gateway.makeUseMain("123", 1);

      expect(cacheMock.set).toHaveBeenCalledWith(
        "123",
        {
          ...draft,
          uses: [
            {
              environment: "AVIATION",
              purpose: "PLEASURE",
              activity: "GLIDER",
              moreDetails: "More details of this vessel",
              mainUse: false,
            },
            {
              environment: "MARITIME",
              purpose: "COMMERCIAL",
              activity: "SAILING",
              moreDetails: "More details of this vessel",
              mainUse: true,
            },
          ],
        },
        { expire: ONE_DAY_SECONDS },
      );
    });
  });
});
