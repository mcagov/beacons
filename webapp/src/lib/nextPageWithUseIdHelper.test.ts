import { nextPageWithUseIdHelper } from "./nextPageWithUseIdHelper";

describe("nextPageWithUseIdHelper function", () => {
  it("returns a URL with a useId parameter", () => {
    expect(nextPageWithUseIdHelper(1, "/lorem/ipsum")).toBe(
      "/lorem/ipsum?useId=1"
    );
  });
});
