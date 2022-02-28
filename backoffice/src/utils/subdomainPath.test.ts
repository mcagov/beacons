import { searchUrl } from "./searchUrl";

describe("searchUrl()", () => {
  it("when running on localhost, return localhost:8081", () => {
    const url = searchUrl("localhost");

    expect(url).toBe("http://localhost:8081/search");
  });

  it("when running on dev, return search.dev.406beacons.com", () => {
    const url = searchUrl("dev.406beacons.com");

    expect(url).toBe("https://search.dev.406beacons.com/search");
  });

  it("when running on production, return search.register-406-beacons.service.gov.uk", () => {
    const url = searchUrl("dev.406beacons.com");

    expect(url).toBe("https://search.dev.406beacons.com/search");
  });
});
