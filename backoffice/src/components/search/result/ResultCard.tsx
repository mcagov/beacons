import { Podcasts } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { BeaconDetails } from "./BeaconDetails";
import { Environments } from "./Environments";
import { Uses } from "./Uses";

export function ResultCard({
  result,
}: {
  result: BeaconSearchResult;
}): JSX.Element {
  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateRows: "5rem 24rem 3rem",
      }}
    >
      <CardHeader
        avatar={<Podcasts />}
        title={result.hexId ?? "N/A"}
        subheader={result.beaconStatus}
      />
      <CardContent sx={{ overflow: "auto", paddingTop: 0 }}>
        <Environments beaconUses={result.beaconUses} />
        <BeaconDetails
          cospasSarsatNumber={result.cospasSarsatNumber}
          lastModifiedDate={result.lastModifiedDate}
        />
        <Uses
          vesselMmsiNumbers={result.vesselMmsiNumbers}
          vesselNames={result.vesselNames}
          vesselCallsigns={result.vesselCallsigns}
          aircraftRegistrationMarks={result.aircraftRegistrationMarks}
          aircraft24bitHexAddresses={result.aircraft24bitHexAddresses}
        />
      </CardContent>
      <CardActions sx={{ minHeight: 0 }}>
        <Button
          size={"small"}
          color={"secondary"}
          component={RouterLink}
          to={(result.isLegacy ? "/legacy-beacons/" : "/beacons/") + result._id}
        >
          View Registration
        </Button>
      </CardActions>
    </Card>
  );
}
