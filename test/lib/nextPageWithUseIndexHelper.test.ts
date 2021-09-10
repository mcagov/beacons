import { nextPageWithUseIndex } from "../../src/lib/nextPageWithUseIndexHelper";

describe("nextPageWithUseIndexHelper function", () => {
  it("returns a URL with a useIndex parameter", () => {
    expect(nextPageWithUseIndex(1, "/lorem/ipsum")).toBe(
      "/lorem/ipsum?useIndex=1"
    );
  });
});
