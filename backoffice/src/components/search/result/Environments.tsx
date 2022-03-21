import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { UseEnvironment } from "../../../entities/UseEnvironment";
import {
  AirplanemodeActive,
  Anchor,
  EmojiPeople,
  Landscape,
} from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";

export function Environments({
  beaconUses,
}: {
  beaconUses: BeaconSearchResult["beaconUses"];
}): JSX.Element | null {
  const environments = Array.from(
    new Set(
      beaconUses
        .map((beaconUse) => beaconUse.environment)
        .filter((environment) => environment.length > 0)
    )
  );
  return (
    <Stack direction={"row"} spacing={1}>
      {environments.map((environment) => {
        return (
          <Chip
            icon={getIcon(environment)}
            label={environment}
            variant="outlined"
            size="small"
            key={environment}
          />
        );
      })}
    </Stack>
  );
}

function getIcon(environment: UseEnvironment | string): JSX.Element {
  switch (environment) {
    case "AVIATION":
      return <AirplanemodeActive />;
    case "MARITIME":
      return <Anchor />;
    case "LAND":
      return <Landscape />;
    default:
      return <EmojiPeople />;
  }
}
