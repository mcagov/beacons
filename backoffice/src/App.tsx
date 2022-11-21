import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { RequireAuth } from "components/auth/RequireAuth";
import { AuthGateway } from "gateways/auth/AuthGateway";
import { BeaconsGateway } from "gateways/beacons/BeaconsGateway";
import { ExportsGateway } from "gateways/exports/ExportsGateway";
import { UsesGateway } from "gateways/uses/UsesGateway";
import { FunctionComponent } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { CertificateView } from "views/exports/certificates/CertificateView";
import { LabelView } from "views/exports/label/LabelView";
import { LetterView } from "views/exports/letters/LetterView";
import { UserRolesView } from "views/UserRolesView";
import "./App.scss";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AuthenticatedPOSTButton } from "./components/AuthenticatedPOSTButton";
import { ErrorState } from "./components/dataPanel/PanelErrorState";
import { LoadingState } from "./components/dataPanel/PanelLoadingState";
import { Footer } from "./components/layout/Footer";
import { Navigation } from "./components/layout/Navigation";
import { PageContent } from "./components/layout/PageContent";
import { applicationConfig } from "./config";
import { BeaconRequestMapper } from "./gateways/mappers/BeaconRequestMapper";
import { BeaconResponseMapper } from "./gateways/mappers/BeaconResponseMapper";
import { LegacyBeaconResponseMapper } from "./gateways/mappers/LegacyBeaconResponseMapper";
import { NotesGateway } from "./gateways/notes/NotesGateway";
import { useGetAuthState } from "./lib/useGetAuthState";
import { Search } from "./Search";
import { UserSettingsProvider } from "./UserSettings";
import { logToServer } from "./utils/logger";
import { SingleBeaconRecordView } from "./views/SingleBeaconRecordView";
import { SingleLegacyBeaconRecordView } from "./views/SingleLegacyBeaconRecordView";
import { DeleteBeaconView } from "views/DeleteBeaconView";

interface ResourceParams {
  id: string;
  letterType: string;
}

const App: FunctionComponent = () => {
  const authState = useGetAuthState();
  if (authState.status === "PENDING") {
    return <LoadingState />;
  }
  if (authState.status === "ERROR") {
    logToServer.error(authState.error);
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
  const exportsGateway = new ExportsGateway(authGateway);

  const SingleBeaconRecordViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();

    return (
      <div>
        <Navigation />
        <SingleBeaconRecordView
          beaconsGateway={beaconsGateway}
          usesGateway={usesGateway}
          notesGateway={notesGateway}
          beaconId={id}
        />
        <Footer />
      </div>
    );
  };

  const SingleLegacyBeaconRecordViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return (
      <div>
        <Navigation />
        <SingleLegacyBeaconRecordView
          beaconsGateway={beaconsGateway}
          beaconId={id}
        />
        <Footer />
      </div>
    );
  };

  const DeleteBeaconViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return (
      <div>
        <Navigation />
        <DeleteBeaconView beaconsGateway={beaconsGateway} beaconId={id} />
        <Footer />
      </div>
    );
  };

  const CertificateViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return <CertificateView exportsGateway={exportsGateway} beaconId={id} />;
  };

  const LabelViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return <LabelView exportsGateway={exportsGateway} beaconId={id} />;
  };

  const LetterViewWithParam: FunctionComponent = () => {
    const { id, letterType } = useParams<ResourceParams>();
    return (
      <LetterView
        exportsGateway={exportsGateway}
        beaconId={id}
        letterType={letterType}
      />
    );
  };

  return (
    <MsalProvider instance={pca}>
      <AuthProvider>
        <UserSettingsProvider>
          <Router basename="/backoffice">
            <RequireAuth>
              <Switch>
                <Route exact path="/">
                  <Navigation />
                  <Search beaconsGateway={beaconsGateway} />
                  <Footer />
                </Route>
                <Route path={`/roles`}>
                  <Navigation />
                  <PageContent>
                    <UserRolesView />
                  </PageContent>
                  <Footer />
                </Route>
                <Route path={`/beacons/:id`}>
                  <SingleBeaconRecordViewWithParam />
                </Route>
                <Route path={`/legacy-beacons/:id`}>
                  <SingleLegacyBeaconRecordViewWithParam />
                </Route>
                <Route path={`/delete/:id`}>
                  <DeleteBeaconViewWithParam />
                </Route>
                <Route path={`/admin`}>
                  <Navigation />
                  <PageContent>
                    <AuthenticatedPOSTButton
                      uri={`${applicationConfig.apiUrl}/export/xlsx`}
                    >
                      Trigger export job
                    </AuthenticatedPOSTButton>
                  </PageContent>
                  <Footer />
                </Route>
                <Route path={`/certificates/:id`}>
                  <CertificateViewWithParam />
                </Route>
                <Route path={`/letters/:letterType/:id/`}>
                  <LetterViewWithParam />
                </Route>
                <Route path={`/label/:id`}>
                  <Navigation />
                  <LabelViewWithParam />
                  <Footer />
                </Route>
                <Route>
                  <Navigation />
                  Page not found. Is the address correct?
                  <Footer />
                </Route>
              </Switch>
            </RequireAuth>
          </Router>
        </UserSettingsProvider>
      </AuthProvider>
    </MsalProvider>
  );
};

export default App;
