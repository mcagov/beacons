import { v4 as uuidv4 } from "uuid";
import { FormCacheFactory, IFormCache } from "../../src/lib/formCache";
import { Registration } from "../../src/lib/registration/registration";

jest.mock(
  "redis-json",
  () =>
    function () {
      return {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
      };
    }
);

describe("FormCache", () => {
  it("should return a singleton instance of the form cache", () => {
    const cache = FormCacheFactory.getCache();

    const secondInstance: IFormCache = FormCacheFactory.getCache();

    expect(cache).toBe(secondInstance);
  });

  it("should return an instance of a registration class for an unknown id", async () => {
    const cache = FormCacheFactory.getCache();

    expect(await cache.get(uuidv4())).toBeInstanceOf(Registration);
  });
});
