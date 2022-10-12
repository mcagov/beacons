import React from "react";
import { SearchErrorBoundary } from "./components/search/SearchErrorBoundary";
import { BeaconsGateway } from "./gateways/beacons/BeaconsGateway";
import { useUserSettings } from "./UserSettings";
import { BeaconRecordsListView as AdvancedSearchView } from "./views/BeaconSearchListView";
import { BeaconExportRecordsListView as ExportSearchView } from "./views/BeaconExportSearchListView";
import { DefaultSearchView } from "./views/DefaultSearchView";

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
    case "export":
      return <ExportSearchView beaconsGateway={beaconsGateway} />;
  }
}
