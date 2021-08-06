import axios from "axios";
import { AadAuthGateway } from "../../src/gateways/AadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../../src/gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconGateway } from "../../src/gateways/BeaconsApiBeaconGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";
import { BeaconsSession } from "../../src/gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { PageURLs } from "../../src/lib/urls";
import { submitRegistration } from "../../src/useCases/submitRegistration";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import { givenIHaveACookieSetAndHaveSignedInIVisit } from "../integration/common/selectors-and-assertions.spec";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    givenIHaveACookieSetAndHaveSignedInIVisit(PageURLs.accountHome);
    givenIHavePreviouslyRegisteredABeacon();
  });
});

const givenIHavePreviouslyRegisteredABeacon = async (): Promise<void> => {
  const beaconsApiAuthGateway: AuthGateway = new AadAuthGateway({
    auth: {
      clientId: Cypress.env("WEBAPP_CLIENT_ID"),
      authority: `https://login.microsoftonline.com/${Cypress.env(
        "AAD_TENANT_ID"
      )}`,
      clientSecret: Cypress.env("WEBAPP_CLIENT_SECRET"),
    },
    apiId: Cypress.env("AAD_API_ID"),
  });

  const beaconsApiGateway = new BeaconsApiBeaconGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const accountHolderApiGateway = new BeaconsApiAccountHolderGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const container: Partial<IAppContainer> = {
    beaconsApiGateway,
    accountHolderApiGateway,
  };

  await submitRegistration(container)(
    singleBeaconRegistration,
    await getAccountHolderAuthId()
  );
};

const getAccountHolderAuthId = async (): Promise<string> => {
  const sessionEndpoint = "/api/auth/session";

  const session: BeaconsSession = await axios.get(sessionEndpoint);

  console.log(session.data); // undefined

  return session.user.authId;
};
