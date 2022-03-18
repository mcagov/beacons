import React from "react";
import { useUserSettings } from "./UserSettings";
import { DefaultSearchView } from "./views/DefaultSearchView";
import { BeaconRecordsListView as AdvancedSearchView } from "./views/BeaconSearchListView";
import { BeaconsGateway } from "./gateways/beacons/BeaconsGateway";
import { SearchErrorBoundary } from "./components/search/SearchErrorBoundary";

export function Search({
  beaconsGateway,
}: {
  beaconsGateway: BeaconsGateway;
}): JSX.Element {
  const [{ searchMode }] = useUserSettings();

  switch (searchMode) {
    case "default":
      return (
        <SearchErrorBoundary>
          <DefaultSearchView />
        </SearchErrorBoundary>
      );
    case "advanced":
      return <AdvancedSearchView beaconsGateway={beaconsGateway} />;
  }
}
