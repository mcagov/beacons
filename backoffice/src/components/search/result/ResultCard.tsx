import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Podcasts } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { Environments } from "./Environments";
import { Uses } from "./Uses";
import { Owner } from "./Owner";

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
      <CardContent sx={{ overflow: "auto" }}>
        <Environments beaconUses={result.beaconUses} />
        <Uses
          vesselMmsiNumbers={result.vesselMmsiNumbers}
          vesselNames={result.vesselNames}
          vesselCallsigns={result.vesselCallsigns}
          aircraftRegistrationMarks={result.aircraftRegistrationMarks}
          aircraft24bitHexAddresses={result.aircraft24bitHexAddresses}
        />
        <Owner beaconOwner={result.beaconOwner} />
      </CardContent>
      <CardActions>
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
