import React from "react";
import { render, screen } from "@testing-library/react";
import { Certificate } from "./Certificate";
import { Environments } from "../../../entities/IUse";

const mockBaseBeacon = {
  recordCreatedDate: "2021-01-01",
  lastModifiedDate: "2021-02-01",
  beaconStatus: "CHANGE",
  hexId: "HEX123",
  manufacturer: "Ocean Signal",
  manufacturerSerialNumber: "SER123",
  beaconModel: "PLB1",
  beaconlastServiced: "2020-01-01",
  beaconCoding: "Coding A",
  batteryExpiryDate: "2025-01-01",
  codingProtocol: "Protocol X",
  cstaNumber: "CSTA-99",
  chkCode: "CHK-11",
  notes: [
    { date: "2021-03-05", note: "Note 1" },
    { date: "2021-02-01", note: "Note 2" },
    { date: "2021-01-02", note: "Note 3" },
    { date: "2022-03-03", note: "Note 4" },
    { date: "2023-03-04", note: "Note 5" },
  ],
  accountHolder: {
    fullName: "Mr A. Holder",
    email: "aholder@mca.gov.uk",
  },
  owners: [
    {
      ownerName: "Mr Owner",
      isMain: true,
      telephoneNumbers: "0117892136545",
      addressLine1: "1 Street",
      addressLine2: "Points West",
      townOrCity: "Bristol",
      postcode: "BS17YG",
      email: "martha@mca.gov.uk",
    },
  ],
  emergencyContacts: [{ fullName: "Emergency Person", telephoneNumber: "999" }],
};

const mockMaritimeUse = {
  environment: Environments.Maritime,
  typeOfUse: "Commercial",
  vesselName: "The Black Pearl",
  homePort: "Tortuga",
  maxPersonOnBoard: 10,
  radioSystems: { VHF: "12345", Other: "Satellite" },
  vesselCallsign: "CALL123",
  mmsiNumber: "987654321",
};

const mockAviationUse = {
  environment: Environments.Aviation,
  aircraftManufacturer: "Boeing",
  aircraftRegistrationMark: "G-ABCD",
  hexAddress: "HEXADDR",
  radioSystems: {},
};

const mockLandUse = {
  environment: Environments.Land,
  windfarmLocation: "North Sea",
  windfarmPeopleCount: "50",
  radioSystems: {},
};

describe("Certificate Component", () => {
  it("renders the main layout and header", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(
      screen.getByText("UK Distress & Security Beacon Registration"),
    ).toBeInTheDocument();
    expect(screen.getByText("UKBeacons@mcga.gov.uk")).toBeInTheDocument();
  });

  it("renders top-level beacon dates and status", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(getField("Record Created Date")).toHaveTextContent("1 January 2021");
    expect(getField("Last Modified")).toHaveTextContent("1 February 2021");
    expect(getField("Beacon Status")).toHaveTextContent("CHANGE");
  });

  it("renders Beacon Details section correctly", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(screen.getByText("Beacon Details:")).toBeInTheDocument();

    expect(getField("Hex Id")).toHaveTextContent("HEX123");
    expect(getField("Manufacturer")).toHaveTextContent("Ocean Signal");
    expect(getField("Manufacturer Serial No")).toHaveTextContent("SER123");
    expect(getField("Beacon Last Serviced")).toHaveTextContent("01/01/2020");
    expect(getField("Battery Expiry Date")).toHaveTextContent("01/01/2025");
    expect(getField("Beacon Model")).toHaveTextContent("PLB1");
  });

  it("renders Notes section correctly and ORDER-BY earliest date", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    const { container } = render(<Certificate beacon={beacon} />);

    const expectedSortedNotes = [
      "02/01/2021: Note 3",
      "01/02/2021: Note 2",
      "05/03/2021: Note 1",
      "03/03/2022: Note 4",
      "04/03/2023: Note 5",
    ];
    const noteElements = container.querySelectorAll(".beacon-notes .note");
    const renderedTexts = Array.from(noteElements).map((el) => el.textContent);

    expect(screen.getByText("NOTES:")).toBeInTheDocument();
    expect(screen.getByText("05/03/2021: Note 1")).toBeInTheDocument();
    expect(screen.getByText("01/02/2021: Note 2")).toBeInTheDocument();
    expect(renderedTexts).toEqual(expectedSortedNotes);
  });

  it("renders Account Holder section correctly", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(screen.getByText("Account Holder:")).toBeInTheDocument();
    expect(screen.getByText("aholder@mca.gov.uk")).toBeInTheDocument();
    expect(getField("Name")).toHaveTextContent("Mr A. Holder");
  });

  it("renders Owners section correctly", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(screen.getByText("Owner Details:")).toBeInTheDocument();

    expect(getField("Owner(s)")).toHaveTextContent("Mr Owner");
    expect(getField("Is Main")).toHaveTextContent("Yes");
    expect(getField("Tels")).toHaveTextContent("0117892136545");

    expect(screen.getByText("1 Street")).toBeInTheDocument();
    expect(screen.getByText("BS17YG")).toBeInTheDocument();
    expect(screen.getByText("martha@mca.gov.uk")).toBeInTheDocument();
  });

  it("renders Emergency Contacts correctly", () => {
    const beacon: any = { ...mockBaseBeacon, uses: [] };
    render(<Certificate beacon={beacon} />);

    expect(screen.getByText("EMERGENCY CONTACTS:")).toBeInTheDocument();
    expect(screen.getByText("Emergency Person:")).toBeInTheDocument();
    expect(screen.getByText("999")).toBeInTheDocument();
  });

  describe("Uses Section", () => {
    it("renders Maritime specific fields", () => {
      const beacon: any = { ...mockBaseBeacon, uses: [mockMaritimeUse] };
      render(<Certificate beacon={beacon} />);

      expect(
        screen.getByText(/Beacon Use - MARITIME \(Commercial\)/),
      ).toBeInTheDocument();
      expect(screen.getByText("The Black Pearl")).toBeInTheDocument(); // Vessel Name
      expect(screen.getByText("Tortuga")).toBeInTheDocument(); // Homeport
      expect(screen.getByText("CALL123")).toBeInTheDocument(); // Callsign
      expect(screen.getByText("987654321")).toBeInTheDocument(); // MMSI

      expect(screen.getByText("VHF:")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
    });

    it("renders Aviation specific fields", () => {
      const beacon: any = { ...mockBaseBeacon, uses: [mockAviationUse] };
      render(<Certificate beacon={beacon} />);

      expect(screen.getByText(/Beacon Use - AVIATION/)).toBeInTheDocument();
      expect(screen.getByText("Boeing")).toBeInTheDocument(); // Aircraft Manufacturer
      expect(screen.getByText("G-ABCD")).toBeInTheDocument(); // Registration
    });

    it("renders Land specific fields", () => {
      const beacon: any = { ...mockBaseBeacon, uses: [mockLandUse] };
      render(<Certificate beacon={beacon} />);

      expect(screen.getByText(/Beacon Use - LAND/)).toBeInTheDocument();
      expect(screen.getByText("North Sea")).toBeInTheDocument(); // Windfarm location
      expect(screen.getByText("50")).toBeInTheDocument(); // Windfarm people count
    });

    it("renders Unknown Use for unrecognized environment", () => {
      const unknownUse = { environment: "BAD" };
      const beacon: any = { ...mockBaseBeacon, uses: [unknownUse] };
      render(<Certificate beacon={beacon} />);

      expect(screen.getByText("Unknown Use")).toBeInTheDocument();
    });

    it("renders multiple uses if present", () => {
      const beacon: any = {
        ...mockBaseBeacon,
        uses: [mockMaritimeUse, mockLandUse],
      };
      render(<Certificate beacon={beacon} />);

      expect(screen.getByText(/#1 Beacon Use - MARITIME/)).toBeInTheDocument();
      expect(screen.getByText(/#2 Beacon Use - LAND/)).toBeInTheDocument();
    });
  });
});

const getField = (title: string) => {
  const label = screen.getByText(title + ":");
  return label.closest("div");
};
