import React from "react";
import { render, screen } from "@testing-library/react";
import { LegacyCertificate } from "./LegacyCertificate";

const mockLegacyBeacon = {
  type: "Legacy",
  proofOfRegistrationDate: "2024-05-01",
  departmentReference: "DEPT-123",
  recordCreatedDate: "2021-01-01",
  lastModifiedDate: "2021-02-01",
  beaconStatus: "MIGRATED",
  hexId: "HEX123",
  cospasSarsatNumber: "CS-999",
  serialNumber: 42,
  manufacturer: "Ocean Signal",
  manufacturerSerialNumber: "SER123",
  beaconModel: "PLB1",
  beaconlastServiced: "2020-01-01",
  beaconCoding: "Coding A",
  batteryExpiryDate: "2025-01-01",
  codingProtocol: "Protocol X",
  cstaNumber: "CSTA-99",
  beaconNote: "A beacon note",
  owners: [
    {
      ownerName: "Mr Owner",
      telephoneNumbers: "0117892136545",
      addressLine1: "1 Street",
      postcode: "BS17YG",
      email: "martha@mca.gov.uk",
    },
  ],
  emergencyContacts: [{ fullName: "Emergency Person" }],
};

const mockModUse = {
  environment: "MOD",
  vesselName: "MCA Test MOD Vessel",
  homePort: "MCA Test Port",
  vesselCallsign: "GABC",
  mmsiNumber: "232001234",
  maxPersonOnBoard: 25,
  fishingVesselPortIdAndNumbers: "PLN-77",
  officialNumber: "ON-4477",
  imoNumber: "IMO-8814",
  rssAndSsrNumber: "SSR-101",
  hullIdNumber: "HULL-55",
  radioSystems: { Communications: "VHF Radio" },
  notes: "MCA Test Note",
};

const mockLandUse = {
  environment: "Land",
  descriptionOfIntendedUse: "MCA Test Land Use",
  numberOfPersonsOnBoard: 4,
  areaOfUse: "MCA Test Area",
  tripInformation: "MCA Test Trip",
  radioSystems: { Communications: "Mobile telephone" },
  notes: "Land note",
};

const mockMaritimeUse = {
  environment: "Maritime",
  vesselType: "Dinghy",
  vesselName: "MCA Test Maritime Vessel",
  homePort: "MCA Test Harbour",
  maxPersonOnBoard: 10,
  vesselCallsign: "CALL123",
  mmsiNumber: "987654321",
  radioSystems: { Communications: "VHF" },
  notes: "Maritime note",
};

const mockAviationUse = {
  environment: "Aviation",
  aircraftType: "Glider",
  aircraftRegistrationMark: "G-ABCD",
  principalAirport: "MCA Test Airport",
  aodSerialNumber: "AOD-1",
  twentyFourBitAddressInHex: "ABC123",
  maxPersonOnBoard: 2,
  radioSystems: { Communications: "Radio" },
  notes: "Aviation note",
};

const mockRigUse = {
  environment: "Rig/Platform",
  rigName: "MCA Test Rig",
  maxPersonOnBoard: 100,
  vesselCallsign: "RIG1",
  mmsiNumber: "111222333",
  imoNumber: "IMO-1",
  radioSystems: { Communications: "Satellite" },
  notes: "Rig note",
};

describe("LegacyCertificate", () => {
  describe("MOD uses", () => {
    it("renders the vessel details for a MOD use", () => {
      renderWithUse(mockModUse);

      expect(getField("Vessel Name")).toHaveTextContent("MCA Test MOD Vessel");
      expect(getField("Homeport")).toHaveTextContent("MCA Test Port");
      expect(getField("Vessel Call Sign")).toHaveTextContent("GABC");
      expect(getField("MMSI Number")).toHaveTextContent("232001234");
    });

    it("renders the vessel identification numbers for a MOD use", () => {
      renderWithUse(mockModUse);

      expect(getField("Fishing Vessel Port ID & Numbers")).toHaveTextContent(
        "PLN-77",
      );
      expect(getField("Official Number")).toHaveTextContent("ON-4477");
      expect(getField("IMO Number")).toHaveTextContent("IMO-8814");
      expect(getField("RSS/SSR Number")).toHaveTextContent("SSR-101");
      expect(getField("Hull ID Number")).toHaveTextContent("HULL-55");
    });
  });

  describe("unrecognised environments", () => {
    it("renders a use with a blank environment as a generic use", () => {
      renderWithUse({ ...mockModUse, environment: "" });

      expect(getField("Vessel Name")).toHaveTextContent("MCA Test MOD Vessel");
      expect(getField("MMSI Number")).toHaveTextContent("232001234");
    });
  });

  describe("routing of recognised environments", () => {
    it("keeps a title-case Land use on the land renderer", () => {
      renderWithUse(mockLandUse);

      expect(getField("Area Of Use")).toHaveTextContent("MCA Test Area");
      expect(getField("Current/Future Trip Information")).toHaveTextContent(
        "MCA Test Trip",
      );

      expect(screen.queryByText("Homeport:")).not.toBeInTheDocument();
      expect(screen.queryByText("MMSI Number:")).not.toBeInTheDocument();
      expect(screen.queryByText("Aircraft Type:")).not.toBeInTheDocument();
    });

    it("keeps the persons count on a Land use", () => {
      renderWithUse(mockLandUse);

      expect(getField("Number Of Persons In Group")).toHaveTextContent("4");
    });

    it("keeps a title-case Maritime use on the maritime renderer", () => {
      renderWithUse(mockMaritimeUse);

      expect(getField("Vessel Name")).toHaveTextContent(
        "MCA Test Maritime Vessel",
      );
      expect(getField("Homeport")).toHaveTextContent("MCA Test Harbour");
      expect(screen.queryByText("Aircraft Type:")).not.toBeInTheDocument();
    });

    it("keeps a title-case Aviation use on the aviation renderer", () => {
      renderWithUse(mockAviationUse);

      expect(getField("Aircraft Registration Mark")).toHaveTextContent(
        "G-ABCD",
      );
      expect(getField("Principal Airport")).toHaveTextContent(
        "MCA Test Airport",
      );
      expect(screen.queryByText("Vessel Call Sign:")).not.toBeInTheDocument();
    });

    it("keeps a Rig/Platform use on the rig renderer", () => {
      renderWithUse(mockRigUse);

      expect(getField("Rig/Platform Name")).toHaveTextContent("MCA Test Rig");
      expect(getField("Callsign")).toHaveTextContent("RIG1");
      expect(screen.queryByText("Aircraft Type:")).not.toBeInTheDocument();
    });
  });
});

const renderWithUse = (use: any) => {
  const beacon: any = { ...mockLegacyBeacon, uses: [use] };
  return render(<LegacyCertificate beacon={beacon} />);
};

const getField = (title: string) => {
  const label = screen.getByText(title + ":");
  return label.closest("div");
};
