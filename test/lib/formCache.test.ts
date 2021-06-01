import { v4 as uuidv4 } from "uuid";
import { FormCacheFactory, IFormCache } from "../../src/lib/formCache";
import { Registration } from "../../src/lib/registration/registration";

describe("FormCache", () => {
  let cache: IFormCache;
  let id: string;

  beforeEach(() => {
    cache = FormCacheFactory.getCache();
    id = uuidv4();
  });

  it("should return a singleton instance of the form cache", () => {
    const secondInstance: IFormCache = FormCacheFactory.getCache();
    expect(cache).toBe(secondInstance);
  });

  it("should return an instance of a registration class for an unknown id", async () => {
    expect(await cache.get(uuidv4())).toBeInstanceOf(Registration);
  });

  describe("clear", () => {
    it("deletes the Registration for a given id", async () => {
      const firstRegistration = await cache.get(id);
      await cache.clear(id);
      const secondRegistrations = await cache.get(id);
      expect(firstRegistration).not.toBe(secondRegistrations);
    });

    it("deletes the Registration for a given id and doesn't delete other registrations", async () => {
      await cache.get(id);
      const secondId = uuidv4();
      const secondRegistration = await cache.get(secondId);
      await cache.clear(id);
      expect((await cache.get(secondId)).getRegistration()).toStrictEqual(
        secondRegistration.getRegistration()
      );
    });
  });
});
