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
import {
  CertificatesView,
  CertificateView,
} from "views/exports/certificates/CertificateView";
import { LettersView, LetterView } from "views/exports/letters/LetterView";
import { LabelsView, LabelView } from "views/exports/label/LabelView";
import { UserRolesView } from "views/UserRolesView";
import "./App.scss";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ErrorState } from "./components/dataPanel/PanelErrorState";
import { LoadingState } from "./components/dataPanel/PanelLoadingState";
import { Footer } from "./components/layout/Footer";
import { Navigation } from "./components/layout/Navigation";
import { PageContent } from "./components/layout/PageContent";
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
import { BeaconExportSearch } from "./views/exports/BeaconExportSearch";
import { AdminView } from "views/AdminView";
import { DataComparisonView } from "views/comparison/DataComparisonView";

interface ResourceParams {
  id: string;
  letterType: string;
}

interface ResourceListParams {
  ids: string;
  lettersType: string;
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
        <Navigation exportsGateway={exportsGateway} />
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
        <Navigation exportsGateway={exportsGateway} />
        <SingleLegacyBeaconRecordView
          beaconsGateway={beaconsGateway}
          beaconId={id}
        />
        <Footer />
      </div>
    );
  };

  const CertificateViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return <CertificateView exportsGateway={exportsGateway} beaconId={id} />;
  };

  const CertificatesViewWithParam: FunctionComponent = () => {
    const { ids } = useParams<ResourceListParams>();
    let beaconIds = ids.split(",");
    return (
      <CertificatesView exportsGateway={exportsGateway} beaconIds={beaconIds} />
    );
  };

  const LabelViewWithParam: FunctionComponent = () => {
    const { id } = useParams<ResourceParams>();
    return <LabelView exportsGateway={exportsGateway} beaconId={id} />;
  };

  const LabelsViewWithParam: FunctionComponent = () => {
    const { ids } = useParams<ResourceListParams>();
    let beaconIds = ids.split(",");
    return <LabelsView exportsGateway={exportsGateway} beaconIds={beaconIds} />;
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

  const LettersViewWithParam: FunctionComponent = () => {
    const { ids, lettersType } = useParams<ResourceListParams>();
    let beaconIds = ids.split(",");
    return (
      <LettersView
        exportsGateway={exportsGateway}
        beaconIds={beaconIds}
        lettersType={lettersType}
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
                  <Navigation exportsGateway={exportsGateway} />
                  <Search beaconsGateway={beaconsGateway} />
                  <Footer />
                </Route>
                <Route path={`/export/search`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <PageContent>
                    <BeaconExportSearch exportsGateway={exportsGateway} />
                  </PageContent>
                </Route>
                <Route path={`/roles`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <PageContent>
                    <UserRolesView />
                  </PageContent>
                  <Footer />
                </Route>
                <Route path={`/comparison/missing`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <PageContent>
                    <DataComparisonView exportsGateway={exportsGateway} />
                  </PageContent>
                  <Footer />
                </Route>
                <Route path={`/beacons/:id`}>
                  <SingleBeaconRecordViewWithParam />
                </Route>
                <Route path={`/legacy-beacons/:id`}>
                  <SingleLegacyBeaconRecordViewWithParam />
                </Route>
                <Route path={`/admin`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <AdminView />
                  <Footer />
                </Route>
                <Route path={`/certificate/:id`}>
                  <CertificateViewWithParam />
                </Route>
                <Route path={`/certificates/:ids`}>
                  <CertificatesViewWithParam />
                </Route>
                <Route path={`/letter/:letterType/:id/`}>
                  <LetterViewWithParam />
                </Route>
                <Route path={`/letters/:lettersType/:ids/`}>
                  <LettersViewWithParam />
                </Route>
                <Route path={`/label/:id`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <LabelViewWithParam />
                  <Footer />
                </Route>
                <Route path={`/labels/:ids`}>
                  <Navigation exportsGateway={exportsGateway} />
                  <LabelsViewWithParam />
                  <Footer />
                </Route>
                <Route>
                  <Navigation exportsGateway={exportsGateway} />
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
