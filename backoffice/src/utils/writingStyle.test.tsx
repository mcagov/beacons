import { FieldValueTypes } from "../components/dataPanel/FieldValue";
import { Activities, Environments, Purposes } from "../entities/IUse";
import {
  formatFieldValue,
  formatForClipboard,
  formatOwners,
  formatUses,
  Placeholders,
  titleCase,
  formatForClipboardWithNotes,
  parseNotesData,
} from "./writingStyle";
import { INote, NoteType } from "../entities/INote";
import { formatDateTime } from "./dateTime";

describe("titleCase()", () => {
  const expectations = [
    { in: "fish and chips", out: "Fish And Chips" },
    { in: "fish_and_chips", out: "Fish And Chips" },
    { in: "HOT_AIR_BALLOON", out: "Hot Air Balloon" },
    { in: "", out: "" },
    { in: " ", out: " " },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(titleCase(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("formatUses()", () => {
  const expectations = [
    { in: [], out: "" },
    {
      in: [
        {
          id: "1",
          environment: Environments.Maritime,
          purpose: Purposes.Commercial,
          activity: Activities.FishingVessel,
          moreDetails: "Bottom trawling for fish fingers",
          mainUse: true,
        },
      ],
      out: "Fishing Vessel (Commercial)",
    },
    {
      in: [
        {
          id: "1",
          environment: Environments.Maritime,
          purpose: Purposes.Commercial,
          activity: Activities.FishingVessel,
          moreDetails: "Bottom trawling for fish fingers",
          mainUse: true,
        },
        {
          id: "2",
          environment: Environments.Aviation,
          purpose: Purposes.Pleasure,
          activity: Activities.Glider,
          moreDetails: "Fly at the local gliding club every fortnight",
          mainUse: true,
        },
      ],
      out: "Fishing Vessel (Commercial), Glider (Pleasure)",
    },
    {
      in: [
        {
          id: "1",
          environment: Environments.Maritime,
          purpose: Purposes.Commercial,
          activity: Activities.FishingVessel,
          moreDetails: "Bottom trawling for fish fingers",
          mainUse: true,
        },
        {
          id: "2",
          environment: Environments.Land,
          activity: Activities.ClimbingMountaineering,
          moreDetails: "Hiking at the weekends",
          mainUse: true,
        },
      ],
      out: "Fishing Vessel (Commercial), Climbing Mountaineering",
    },
    {
      in: [
        {
          id: "1",
          environment: Environments.Maritime,
          activity: Activities.Other,
          otherActivity: "On my boat",
          moreDetails: "Hiking at the weekends",
          mainUse: true,
        },
      ],
      out: "On My Boat",
    },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${expectation.in} ==> ${expectation.out}`, () => {
      expect(formatUses(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("formatOwners()", () => {
  const expectations = [
    { in: [], out: "" },
    {
      in: [
        {
          id: "1",
          fullName: "Steve Stevington",
          email: "steve@thestevingtons.com",
          isMain: true,
          telephoneNumber: "07826 543728",
          addressLine1: "FFF",
          addressLine2: "59 Stevenswood Road",
          townOrCity: "Bristol",
          county: "",
          postcode: "BS8 9NW",
          country: "United Kingdom",
        },
      ],
      out: "Steve Stevington",
    },
    {
      in: [
        {
          id: "1",
          fullName: "Steve Stevington",
          email: "steve@thestevingtons.com",
          isMain: true,
          telephoneNumber: "07826 543728",
          addressLine1: "FFF",
          addressLine2: "59 Stevenswood Road",
          townOrCity: "Bristol",
          county: "",
          postcode: "BS8 9NW",
          country: "United Kingdom",
        },
        {
          id: "2",
          fullName: "Prunella Stevington",
          email: "prunella@thestevingtons.com",
          isMain: false,
          telephoneNumber: "07826 543728",
          addressLine1: "FFF",
          addressLine2: "59 Stevenswood Road",
          townOrCity: "Bristol",
          county: "",
          postcode: "BS8 9NW",
          country: "United Kingdom",
        },
      ],
      out: "Steve Stevington, Prunella Stevington",
    },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${expectation.in} ==> ${expectation.out}`, () => {
      expect(formatOwners(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("formatFieldValue()", () => {
  const expectations = [
    { in: undefined, out: <i>{Placeholders.NoData}</i> },
    { in: "", out: <i>{Placeholders.NoData}</i> },
    { in: "Beacons", out: <b>BEACONS</b> },
    { in: "1234", out: <b>1234</b> },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(formatFieldValue(expectation.in)).toEqual(expectation.out);
    });
  });

  it(`formats ${FieldValueTypes.MULTILINE} values correctly i.e. will not show ${Placeholders.NoData} if value is missing`, () => {
    expect(formatFieldValue("", FieldValueTypes.MULTILINE)).toEqual(<></>);
    expect(formatFieldValue(undefined, FieldValueTypes.MULTILINE)).toEqual(
      <></>,
    );
  });

  it("shows the multiline value if value exists", () => {
    expect(formatFieldValue("anything", FieldValueTypes.MULTILINE)).toEqual(
      <b>ANYTHING</b>,
    );
  });

  it("handles number types", () => {
    expect(formatFieldValue(12345)).toEqual(<b>12345</b>);
  });

  it("handles undefined", () => {
    expect(formatFieldValue(undefined)).toEqual(<i>{Placeholders.NoData}</i>);
  });

  it("handles null", () => {
    expect(formatFieldValue(null)).toEqual(<i>{Placeholders.NoData}</i>);
  });
});

describe("formatForClipboard", () => {
  it("explicitly states 'N/A' if there is an empty array for a key", () => {
    const dynamicLegacyBeaconData = { secondaryOwners: [] };

    expect(formatForClipboard(dynamicLegacyBeaconData)).toEqual(
      "Secondary Owners:    N/A\n",
    );
  });

  it("explicitly states 'N/A' if there is an empty object for a key", () => {
    const dynamicLegacyBeaconData = { owner: {} };

    expect(formatForClipboard(dynamicLegacyBeaconData)).toEqual(
      "Owner:    N/A\n",
    );
  });

  it("exports nested data in its own section", () => {
    const nestedData = { owner: { name: "Steve", email: "steve@mail.com" } };

    expect(formatForClipboard(nestedData)).toEqual(
      "\n=====OWNER=====\nName:    Steve\nEmail:    steve@mail.com\n",
    );
  });

  it("exports date is in the correct format", () => {
    const dynamicLegacyBeaconData1 = {
      batteryExpiryDate: formatDateTime("2020-08-07"),
      lastServiceDate: formatDateTime("2021-04-14"),
    };
    const dynamicLegacyBeaconData2 = {
      batteryExpiryDate: formatDateTime("2020-09-01T23:58:29+01:00"),
      lastServiceDate: formatDateTime("2021-06-11T12:47:14+01:00"),
      firstRegistrationDate: formatDateTime("2004-10-28 00:00:00"),
      createdDate: formatDateTime("2020-08-02T21:33:13"),
      lastModifiedDate: formatDateTime("2021-08-02T21:33:13"),
    };
    const dynamicLegacyBeaconData3 = {
      batteryExpiryDate: formatDateTime("01/2028"),
      lastServiceDate: formatDateTime("2025-02"),
    };

    const dynamicBeaconData1 = {
      batteryExpiryDate: formatDateTime("01/02/2020"),
      lastServicedDate: formatDateTime("01/02/2020"),
      registeredDate: formatDateTime("08/06/2018"),
      lastModifiedDate: formatDateTime("01/02/2021"),
    };

    const dynamicBeaconData2 = {
      batteryExpiryDate: formatDateTime("2020-02-01T00:00"),
      lastServicedDate: formatDateTime("2020-02-01T00:00"),
      registeredDate: formatDateTime("2018-06-08T00:00"),
      lastModifiedDate: formatDateTime("2021-02-01T00:00"),
    };

    expect(formatForClipboard(dynamicLegacyBeaconData1)).toEqual(
      "Battery Expiry Date:    07/08/2020\n" +
        "Last Service Date:    14/04/2021\n",
    );
    expect(formatForClipboard(dynamicLegacyBeaconData2)).toEqual(
      "Battery Expiry Date:    01/09/2020\n" +
        "Last Service Date:    11/06/2021\n" +
        "First Registration Date:    28/10/2004\n" +
        "Created Date:    02/08/2020\n" +
        "Last Modified Date:    02/08/2021\n",
    );
    expect(formatForClipboard(dynamicLegacyBeaconData3)).toEqual(
      "Battery Expiry Date:    01/2028\n" + "Last Service Date:    02/2025\n",
    );
    expect(
      formatForClipboardWithNotes(
        dynamicBeaconData1,
        null as unknown as INote[],
      ),
    ).toEqual(
      "Battery Expiry Date:    01/02/2020\n" +
        "Last Serviced Date:    01/02/2020\n" +
        "Registered Date:    08/06/2018\n" +
        "Last Modified Date:    01/02/2021\n",
    );
    expect(
      formatForClipboardWithNotes(
        dynamicBeaconData2,
        null as unknown as INote[],
      ),
    ).toEqual(
      "Battery Expiry Date:    01/02/2020\n" +
        "Last Serviced Date:    01/02/2020\n" +
        "Registered Date:    08/06/2018\n" +
        "Last Modified Date:    01/02/2021\n",
    );
  });

  it("Manufacturer Serial Number is in the correct format", () => {
    const dynamicBeaconData = {
      manufacturerSerialNumber: "1407312904",
    };
    const dynamicBeaconData2 = {
      manufacturerSerialNumber: "17052",
    };

    expect(formatForClipboard(dynamicBeaconData)).toEqual(
      "Manufacturer Serial Number:    1407312904\n",
    );
    expect(
      formatForClipboardWithNotes(
        dynamicBeaconData,
        null as unknown as INote[],
      ),
    ).toEqual("Manufacturer Serial Number:    1407312904\n");

    expect(formatForClipboard(dynamicBeaconData2)).toEqual(
      "Manufacturer Serial Number:    17052\n",
    );
    expect(
      formatForClipboardWithNotes(
        dynamicBeaconData2,
        null as unknown as INote[],
      ),
    ).toEqual("Manufacturer Serial Number:    17052\n");
  });

  it("Ids and Versioning are in the correct format", () => {
    const dynamicLegacyBeaconData = {
      pkBeaconId: 6062,
      coding: "14740",
      mti: 304,
      createUserId: 2889,
      updateUserId: 2889,
      versioning: 0,
    };

    expect(formatForClipboard(dynamicLegacyBeaconData)).toEqual(
      "Pk Beacon Id:    6062\n" +
        "Coding:    14740\n" +
        "Mti:    304\n" +
        "Create User Id:    2889\n" +
        "Update User Id:    2889\n" +
        "Versioning:    0\n",
    );
    expect(
      formatForClipboardWithNotes(
        dynamicLegacyBeaconData,
        null as unknown as INote[],
      ),
    ).toEqual(
      "Pk Beacon Id:    6062\n" +
        "Coding:    14740\n" +
        "Mti:    304\n" +
        "Create User Id:    2889\n" +
        "Update User Id:    2889\n" +
        "Versioning:    0\n",
    );
  });

  it("export notes is in the correct format", () => {
    const notes: INote[] = [
      {
        id: "id",
        beaconId: "beaconId",
        text: "Label Generated",
        type: NoteType.RECORD_HISTORY,
        createdDate: "2020-02-06T00:00:00Z",
        userId: "userId",
        fullName: "SYSTEM",
        email: "",
      },
      {
        id: "id",
        beaconId: "beaconId",
        text: "Beacon MMSI coded, assuming COSPAS SARSAT Type Approval 1351. Generate labels",
        type: NoteType.GENERAL,
        createdDate: "2026-02-06T00:00:00Z",
        userId: "userId",
        fullName: "Full Name",
        email: "example@emailaddress.com",
      },
    ];

    expect(formatForClipboard(parseNotesData(notes))).toEqual(
      "\n" +
        "=====NOTES=====\n" +
        "\n" +
        "-----NOTES (1)-----\n" +
        "Type Of Note:    RECORD_HISTORY\n" +
        "Note:    Label Generated\n" +
        "Noted By:    SYSTEM\n" +
        "Noted By Email Address:    N/A\n" +
        "Date:    06/02/2020\n" +
        ",\n" +
        "-----NOTES (2)-----\n" +
        "Type Of Note:    GENERAL\n" +
        "Note:    Beacon MMSI coded, assuming COSPAS SARSAT Type Approval 1351. Generate labels\n" +
        "Noted By:    Full Name\n" +
        "Noted By Email Address:    example@emailaddress.com\n" +
        "Date:    06/02/2026" +
        "\n",
    );
  });
});
