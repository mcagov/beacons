import { GetServerSidePropsResult } from "next";
import { showCookieBanner } from "../../lib/cookies";
import { withoutErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { AccountPageURLs } from "../../lib/urls";
import { DeleteRegistrationProps } from "../../pages/manage-my-registrations/delete";
import { Rule } from "./Rule";

export class GivenUserIsDeletingARegistration_WhenUserViewsPage_ThenDisplayPage
  implements Rule
{
  private context: BeaconsGetServerSidePropsContext;
  private validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  async action(): Promise<GetServerSidePropsResult<DeleteRegistrationProps>> {
    const { getBeaconsByAccountHolderId, getOrCreateAccountHolder } =
      this.context.container;

    const accountHolder = await getOrCreateAccountHolder(this.context.session);
    const registrationToBeDeleted = (
      await getBeaconsByAccountHolderId(accountHolder.id)
    ).find((beacon) => beacon.id == this.context.query.id);

    return {
      props: {
        form: withoutErrorMessages({}, this.validationRules),
        previousPageURL: AccountPageURLs.accountHome,
        beacon: registrationToBeDeleted,
        showCookieBanner: showCookieBanner(this.context),
      },
    };
  }
}
