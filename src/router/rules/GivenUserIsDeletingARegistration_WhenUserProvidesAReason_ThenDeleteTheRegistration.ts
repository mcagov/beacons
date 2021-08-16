import { GetServerSidePropsResult } from "next";
import { ReasonsForDeletingARegistration } from "../../entities/ReasonsForDeletingARegistration";
import { isValid } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { PageURLs } from "../../lib/urls";
import {
  DeleteRegistrationForm,
  DeleteRegistrationProps,
} from "../../pages/manage-my-registrations/delete";
import { IDeleteBeaconResult } from "../../useCases/deleteBeacon";

export class GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isValid(await this.form(), this.validationRules)
    );
  }

  public async action(): Promise<
    GetServerSidePropsResult<DeleteRegistrationProps>
  > {
    const { deleteBeacon } = this.context.container;

    const { success }: IDeleteBeaconResult = await deleteBeacon(
      await this.reasonForDeletion(),
      this.registrationId(),
      await this.accountHolderId()
    );

    if (success) return redirectUserTo(PageURLs.deleteRegistrationSuccess);
    else redirectUserTo(PageURLs.deleteRegistrationFailure);
  }

  private async form(): Promise<DeleteRegistrationForm> {
    return await this.context.container.parseFormDataAs<DeleteRegistrationForm>(
      this.context.req
    );
  }

  private registrationId(): string {
    return this.context.query.id as string;
  }

  private async accountHolderId(): Promise<string> {
    return (
      await this.context.container.getOrCreateAccountHolder(
        this.context.session
      )
    ).id;
  }

  private async reasonForDeletion(): Promise<string> {
    const form = await this.form();

    if (form.reasonForDeletion === ReasonsForDeletingARegistration.OTHER)
      return form.anotherReasonText;

    return (await this.form()).reasonForDeletion;
  }
}
