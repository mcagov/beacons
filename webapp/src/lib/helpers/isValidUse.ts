import { DraftBeaconUse } from "../../entities/DraftBeaconUse";

export const isValidUse = (use: DraftBeaconUse): boolean => {
  const useProperties = Object.keys(use);

  if (!useProperties.includes("environment")) return false;
  if (!useProperties.includes("activity")) return false;
  if (!useProperties.includes("moreDetails")) return false;

  if (use["activity"] === "OTHER" && use["environment"] !== "LAND")
    return useProperties.includes("otherActivityText");
  if (use["environment"] === "MARITIME" || use["environment"] === "AVIATION")
    return useProperties.includes("purpose");

  if (use["environment"] === "LAND" && use["activity"] === "WORKING_REMOTELY")
    return useProperties.includes("workingRemotelyLocation");
  if (use["environment"] === "LAND" && use["activity"] === "WINDFARM")
    return useProperties.includes("windfarmLocation");
  if (use["environment"] === "LAND" && use["activity"] === "OTHER") {
    return (
      useProperties.includes("otherActivityText") &&
      useProperties.includes("otherActivityLocation")
    );
  }

  return true;
};
