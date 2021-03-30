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

  it("should return an instance of a registration class for an unknown id", () => {
    expect(cache.get(uuidv4())).toBeInstanceOf(Registration);
  });

  it("should return the same instance after it is updated", () => {
    const registration = cache.get(id);
    cache.update(id, { hexId: "Beacon life" });
    expect(cache.get(id)).toBe(registration);
  });
});
