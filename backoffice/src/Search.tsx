import React from "react";
import { useUserSettings } from "./UserSettings";
import { DefaultSearchView } from "./views/DefaultSearchView";
import { BeaconRecordsListView as AdvancedSearchView } from "./views/BeaconSearchListView";
import { BeaconsGateway } from "./gateways/beacons/BeaconsGateway";

export function Search({
  beaconsGateway,
}: {
  beaconsGateway: BeaconsGateway;
}): JSX.Element {
  const [{ searchMode }] = useUserSettings();

  switch (searchMode) {
    case "default":
      return <DefaultSearchView />;
    case "advanced":
      return <AdvancedSearchView beaconsGateway={beaconsGateway} />;
  }
}
