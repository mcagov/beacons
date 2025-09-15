import { FieldValueTypes } from "../components/dataPanel/FieldValue";
import { Activities, Environments, Purposes } from "../entities/IUse";
import {
  formatFieldValue,
  formatForClipboard,
  formatOwners,
  formatUses,
  Placeholders,
  titleCase,
  isDate,
} from "./writingStyle";

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

describe("IsDate()", () => {
  const expectations = [
    { in: "07/08/2020", out: true },
    { in: "2012-01-01", out: true },
    { in: "01/2028", out: true },
    { in: "2025-02", out: true },
    { in: "2020-09-01T23:58:29+01:00", out: true },
    { in: "2024-03-22T10:28:35.537234Z", out: true },
    { in: null, out: false },
    { in: "HOT_AIR_BALLOON", out: false },
    { in: "", out: false },
    { in: " ", out: false },
  ];

  expectations.forEach((expectation) => {
    it(`checks value ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(isDate(expectation.in)).toEqual(expectation.out);
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

  it("exports date in the correct format", () => {
    const dynamicLegacyBeaconData1 = {
      batteryExpiryDate: "2020-08-07",
      lastServiceDate: "2021-04-14",
    };
    const dynamicLegacyBeaconData2 = {
      batteryExpiryDate: "2020-09-01T23:58:29+01:00",
      lastServiceDate: "2021-06-11T12:47:14+01:00",
    };
    const dynamicLegacyBeaconData3 = {
      batteryExpiryDate: "01/2028",
      lastServiceDate: "2025-02",
    };

    expect(formatForClipboard(dynamicLegacyBeaconData1)).toEqual(
      "Battery Expiry Date:    07/08/2020\n" +
        "Last Service Date:    14/04/2021\n",
    );
    expect(formatForClipboard(dynamicLegacyBeaconData2)).toEqual(
      "Battery Expiry Date:    01/09/2020\n" +
        "Last Service Date:    11/06/2021\n",
    );
    expect(formatForClipboard(dynamicLegacyBeaconData3)).toEqual(
      "Battery Expiry Date:    01/2028\n" + "Last Service Date:    02/2025\n",
    );
  });
});
