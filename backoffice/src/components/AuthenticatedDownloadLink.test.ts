import { parseFilename } from "./AuthenticatedDownloadLink";

describe("filename()", () => {
  it("parses the attachment filename from the HTTP Content-Disposition header", () => {
    const headers = {
      get: jest
        .fn()
        .mockReturnValue(
          "attachment; filename=19700101-Beacons_Data-Official Sensitive - Personal.csv"
        ),
    };
    const parsed = parseFilename(headers as any as Headers);

    expect(parsed).toBe(
      "19700101-Beacons_Data-Official Sensitive - Personal.csv"
    );
  });

  it("parses another attachment filename from the HTTP Content-Disposition header", () => {
    const headers = {
      get: jest
        .fn()
        .mockReturnValue(
          "attachment; filename=19700102-Beacons_Data-Official Sensitive - Personal.csv"
        ),
    };
    const parsed = parseFilename(headers as any as Headers);

    expect(parsed).toBe(
      "19700102-Beacons_Data-Official Sensitive - Personal.csv"
    );
  });
});
