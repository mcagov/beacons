import { nextPageWithUseIndexHelper } from "../../src/lib/nextPageWithUseIndexHelper";

describe("nextPageWithUseIdHelper function", () => {
  it("returns a URL with a useId parameter", () => {
    expect(nextPageWithUseIndexHelper(1, "/lorem/ipsum")).toBe(
      "/lorem/ipsum?useId=1"
    );
  });
});
