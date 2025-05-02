import { redirectUserTo } from "../../src/lib/redirectUserTo";

describe("redirectUserTo()", () => {
  it("should return a redirect to the provided url", () => {
    const result = redirectUserTo("/arbitrary-url");

    expect(result).toMatchObject({
      redirect: {
        destination: "/arbitrary-url",
      },
    });
  });

  it("the HTTP method of the redirected request should be a GET", () => {
    const result = redirectUserTo("/arbitrary-url");

    expect(result).toMatchObject({
      redirect: {
        statusCode: 303,
      },
    });
  });
});
