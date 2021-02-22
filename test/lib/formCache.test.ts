import { v4 as uuidv4 } from "uuid";
import {
  BeaconCacheEntry,
  FormCacheFactory,
  IFormCache,
} from "../../src/lib/formCache";

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

  it("should return an empty object for an unknown cache entry", () => {
    expect(cache.get(uuidv4())).toStrictEqual({});
  });

  it("should handle null form data", () => {
    cache.update(id, null);
    expect(cache.get(id)).toStrictEqual({});
  });

  it("should handle undefined form data", () => {
    cache.update(id, void 0);
    expect(cache.get(id)).toStrictEqual({});
  });

  it("should set the cache for the given id", () => {
    const formData: BeaconCacheEntry = { manufacturer: "ASOS" };
    cache.update(id, formData);

    expect(cache.get(id)).toStrictEqual(formData);
  });

  it("should update the cache object with the provided updated value", () => {
    const formData: BeaconCacheEntry = { manufacturer: "ASOS" };
    cache.update(id, formData);

    const updatedFormData: BeaconCacheEntry = { manufacturer: "TOPSHOP" };
    cache.update(id, updatedFormData);

    expect(cache.get(id)).toStrictEqual(updatedFormData);
  });

  it("should only update the provided form fields", () => {
    const formData: BeaconCacheEntry = { manufacturer: "ASOS" };
    cache.update(id, formData);

    const updatedFormData: BeaconCacheEntry = { model: "TROUSERS" };
    cache.update(id, updatedFormData);

    expect(cache.get(id)).toStrictEqual({
      manufacturer: "ASOS",
      model: "TROUSERS",
    });
  });

  it("should update the overriding form field and add additional fields", () => {
    const formData: BeaconCacheEntry = { manufacturer: "ASOS" };
    cache.update(id, formData);

    const updatedFormData: BeaconCacheEntry = {
      manufacturer: "TOPSHOP",
      model: "TROUSERS",
    };
    cache.update(id, updatedFormData);

    expect(cache.get(id)).toStrictEqual(updatedFormData);
  });
});
