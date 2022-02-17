import { GetServerSidePropsResult } from "next";
import { showCookieBanner } from "../../lib/cookies";
import { FormJSON } from "../../lib/form/FormManager";
import { isInvalid, withErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { DeleteRegistrationProps } from "../../pages/manage-my-registrations/delete";

export class GivenUserIsDeletingARegistration_WhenUserDoesNotProvideAReason_ThenShowErrorMessage {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isInvalid(await this.form(), this.validationRules)
    );
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
        beacon: registrationToBeDeleted,
        form: await withErrorMessages(this.form(), this.validationRules),
        showCookieBanner: showCookieBanner(this.context),
      },
    };
  }

  private async form(): Promise<FormJSON> {
    return await this.context.container.parseFormDataAs<FormJSON>(
      this.context.req
    );
  }
}
