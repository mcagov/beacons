import { AadAuthGateway } from "../../src/gateways/aadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../../src/gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconGateway } from "../../src/gateways/BeaconsApiBeaconGateway";
import { appContainer } from "../../src/lib/appContainer";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { PageURLs } from "../../src/lib/urls";
import { getOrCreateAccountHolder } from "../../src/useCases/getOrCreateAccountHolder";
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
  const context: IAppContainer = {
    ...appContainer,
    beaconsApiAuthGateway: new AadAuthGateway({
      auth: {
        clientId: Cypress.env("WEBAPP_CLIENT_ID"),
        authority: `https://login.microsoftonline.com/${Cypress.env(
          "AAD_TENANT_ID"
        )}`,
        clientSecret: Cypress.env("WEBAPP_CLIENT_SECRET"),
      },
      apiId: Cypress.env("AAD_API_ID"),
    }),
    accountHolderApiGateway: new BeaconsApiAccountHolderGateway(
      Cypress.env("API_URL")
    ),
    beaconsApiGateway: new BeaconsApiBeaconGateway(Cypress.env("API_URL")),
    govNotifyGateway: {
      sendEmail: () => new Promise((resolve, reject) => false),
    },
  };

  const accountHolder = await getOrCreateAccountHolder(context)({
    user: { authId: Cypress.env("AUTH_ID") },
  });

  await submitRegistration(context)(singleBeaconRegistration, accountHolder.id);
};
