import { FieldValueTypes } from "../components/dataPanel/FieldValue";
import { Activities, Environments, Purposes } from "../entities/IUse";
import {
  formatFieldValue,
  formatForClipboard,
  formatOwners,
  formatUses,
  Placeholders,
  titleCase,
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
});
