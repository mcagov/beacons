import { PublicClientApplication } from "@azure/msal-browser";
import { RequireAuth } from "components/auth/RequireAuth";
import { AuthGateway } from "gateways/auth/AuthGateway";
import { BeaconsGateway } from "gateways/beacons/BeaconsGateway";
import { UsesGateway } from "gateways/uses/UsesGateway";
import React, { FunctionComponent } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import "./App.scss";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import { Footer } from "./components/layout/Footer";
import { Navigation } from "./components/layout/Navigation";
import { BeaconRequestMapper } from "./gateways/mappers/BeaconRequestMapper";
import { BeaconResponseMapper } from "./gateways/mappers/BeaconResponseMapper";
import { LegacyBeaconResponseMapper } from "./gateways/mappers/LegacyBeaconResponseMapper";
import { NotesGateway } from "./gateways/notes/NotesGateway";
import { BeaconRecordsListView } from "./views/BeaconRecordsListView";
import { SingleBeaconRecordView } from "./views/SingleBeaconRecordView";
import { SingleLegacyBeaconRecordView } from "./views/SingleLegacyBeaconRecordView";
import { ErrorState } from "./components/dataPanel/PanelErrorState";
import { LoadingState } from "./components/dataPanel/PanelLoadingState";
import { useGetAuthState } from "./lib/useGetAuthState";
import { UserSettingsProvider } from "./UserContext";
import { Search } from "./Search";

interface ResourceParams {
  id: string;
}

const App: FunctionComponent = () => {
  const authState = useGetAuthState();
  if (authState.status === "PENDING") {
    return <LoadingState />;
  }
  if (authState.status === "ERROR") {
    return <ErrorState>Error loading authentication configuration</ErrorState>;
  }
  const pca = new PublicClientApplication(authState.config);
  const beaconResponseMapper = new BeaconResponseMapper();
  const legacyBeaconResponseMapper = new LegacyBeaconResponseMapper();
  const authGateway = new AuthGateway(pca);
  const beaconRequestMapper = new BeaconRequestMapper();
  const beaconsGateway = new BeaconsGateway(
    beaconResponseMapper,
    legacyBeaconResponseMapper,
    beaconRequestMapper,
    authGateway
  );
  const usesGateway = new UsesGateway(beaconResponseMapper, authGateway);
  const notesGateway = new NotesGateway(authGateway);

  const SingleBeaconRecordViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return (
      <SingleBeaconRecordView
        beaconsGateway={beaconsGateway}
        usesGateway={usesGateway}
        notesGateway={notesGateway}
        beaconId={id}
      />
    );
  };

  const SingleLegacyBeaconRecordViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return (
      <SingleLegacyBeaconRecordView
        beaconsGateway={beaconsGateway}
        beaconId={id}
      />
    );
  };

  return (
    <AuthWrapper pca={pca}>
      <UserSettingsProvider>
        <Router basename="/backoffice">
          <Navigation />
          <RequireAuth>
            <Switch>
              <Route exact path="/">
                <BeaconRecordsListView beaconsGateway={beaconsGateway} />
              </Route>
              <Route path={`/beacons/:id`}>
                <SingleBeaconRecordViewWithParam />
              </Route>
              <Route path={`/legacy-beacons/:id`}>
                <SingleLegacyBeaconRecordViewWithParam />
              </Route>
              <Route path="/search">
                <Search beaconsGateway={beaconsGateway} />
              </Route>
              <Route>Page not found. Is the address correct?</Route>
            </Switch>
          </RequireAuth>
        </Router>
        <Footer />
      </UserSettingsProvider>
    </AuthWrapper>
  );
};

export default App;
