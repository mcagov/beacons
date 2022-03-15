import { Chip } from "@mui/material";
import {
  AirplanemodeActive,
  Anchor,
  Landscape,
  Podcasts,
  SvgIconComponent,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { ResultCard } from "@appbaseio/reactivesearch";
import React from "react";
import { BeaconStatus } from "../../entities/BeaconStatus";
import { UseEnvironment } from "../../entities/UseEnvironment";

export const SearchResult = ({ item }: { item: any }): JSX.Element => {
  return (
    <ResultCard key={item._id}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignContent: "center",
          height: "100%",
          gap: "0.5rem",
        }}
      >
        <Chip
          label={item.hexId}
          icon={<Podcasts />}
          component={RouterLink}
          to={(item.isLegacy ? "/legacy-beacons/" : "/beacons/") + item.id}
          clickable
        />
        {exists(item.beaconUses) && (
          <Environments
            environments={item.beaconUses.map(
              (use: { environment: any }) => use.environment
            )}
          />
        )}
        <ResultCard.Description>
          <table style={{ textAlign: "left" }}>
            <tbody>
              {exists(item.vesselMmsiNumbers) && (
                <tr>
                  <th>MMSI number(s):</th>
                  <td>{item.vesselMmsiNumbers}</td>
                </tr>
              )}
              {exists(item.vesselNames) && (
                <tr>
                  <th>Vessel name(s):</th>
                  <td>{item.vesselNames}</td>
                </tr>
              )}
              {exists(item.vesselCallsigns) && (
                <tr>
                  <th>Callsign(s):</th>
                  <td>{item.vesselCallsigns}</td>
                </tr>
              )}
              {exists(item.aircraftRegistrationMarks) && (
                <tr>
                  <th>Aircraft registration mark(s):</th>
                  <td>{item.aircraftRegistrationMarks}</td>
                </tr>
              )}
              {exists(item.aircraft24bitHexAddresses) && (
                <tr>
                  <th>Aircraft 24-bit hex address(es):</th>
                  <td>{item.aircraft24bitHexAddresses}</td>
                </tr>
              )}
            </tbody>
          </table>
        </ResultCard.Description>
        <StatusBar status={item.beaconStatus} />
      </div>
    </ResultCard>
  );
};

function exists<T>(field: Array<T> | unknown): boolean {
  return Array.isArray(field) && field.length > 0;
}

function StatusBar({ status }: { status: BeaconStatus }): JSX.Element {
  return <Chip label={status} size={"small"} variant="outlined" />;
}

function Environments({
  environments,
}: {
  environments: UseEnvironment[];
}): JSX.Element {
  const icons: Record<UseEnvironment, SvgIconComponent> = {
    AVIATION: AirplanemodeActive,
    MARITIME: Anchor,
    LAND: Landscape,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      {environments.map((environment) => {
        return (
          <Chip
            icon={React.createElement(icons[environment])}
            label={environment}
            variant="outlined"
            size="small"
          />
        );
      })}
    </div>
  );
}
