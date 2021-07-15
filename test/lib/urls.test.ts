import { formatUrlQueryParams } from "../../src/lib/urls";

describe("format URL query params function", () => {
  let url;
  let queryParamMap;

  beforeEach(() => {
    url = "/beacons";
    queryParamMap = { useIndex: 0 };
  });

  it("should add a query param if none is specified", () => {
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0"
    );
  });

  it("should add an ampersand if a query param is already specified", () => {
    url += "?beaconIndex=0";
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?beaconIndex=0&useIndex=0"
    );
  });

  it("should correctly combine multiple query params", () => {
    queryParamMap = { useIndex: 0, beaconIndex: 0, hexId: "hello" };
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0&beaconIndex=0&hexId=hello"
    );
  });

  it("should not overwrite query params already in the url", () => {
    url += "?useIndex=0";
    queryParamMap = { useIndex: 0, beaconIndex: 0 };
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0&beaconIndex=0"
    );
  });

  it("should URL-encode strings", () => {
    url += "?useIndex=0";
    queryParamMap = {
      action: "here are some chars that should be URL-encoded",
    };
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0&action=here%20are%20some%20chars%20that%20should%20be%20URL-encoded"
    );
  });
});
