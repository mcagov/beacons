import { searchUrl, serviceUrl } from "./urls";

describe("searchUrl()", () => {
  it("when running on localhost, return localhost:8081", () => {
    const deployedHostname = "localhost";
    const url = searchUrl(deployedHostname);

    expect(url).toBe("http://localhost:8081/search/");
  });

  it("when running on dev, return search.dev.406beacons.com", () => {
    const deployedHostname = "dev.406beacons.com";
    const url = searchUrl(deployedHostname);

    expect(url).toBe("https://search.dev.406beacons.com/search/");
  });

  it("when running on production, return search.register-406-beacons.service.gov.uk", () => {
    const deployedHostname = "register-406-beacons.service.gov.uk";
    const url = searchUrl(deployedHostname);

    expect(url).toBe(
      "https://search.register-406-beacons.service.gov.uk/search/"
    );
  });
});

describe("serviceUrl()", () => {
  it("when running on localhost, return localhost:8080/spring-api", () => {
    const deployedHostname = "localhost";
    const url = serviceUrl(deployedHostname);

    expect(url).toBe("http://localhost:8080/spring-api");
  });

  it("when running on dev, return https://dev.406beacons.com/spring-api", () => {
    const deployedHostname = "dev.406beacons.com";
    const url = serviceUrl(deployedHostname);

    expect(url).toBe("https://dev.406beacons.com/spring-api");
  });

  it("when running on production, return https://register-406-beacons.service.gov.uk/spring-api", () => {
    const deployedHostname = "register-406-beacons.service.gov.uk";
    const url = serviceUrl(deployedHostname);

    expect(url).toBe("https://register-406-beacons.service.gov.uk/spring-api");
  });
});
