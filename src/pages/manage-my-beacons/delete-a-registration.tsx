import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormFieldset, FormGroup, FormLegend } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { Beacon } from "../../entities/Beacon";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { Rule } from "../../router/rules/Rule";

export interface DeleteRegistrationProps {
  previousPageURL: PageURLs;
  registration: Beacon;
  showCookieBanner: boolean;
}

export const DeleteRegistration: FunctionComponent<DeleteRegistrationProps> = ({
  previousPageURL,
  registration,
  showCookieBanner,
}: DeleteRegistrationProps): JSX.Element => {
  const pageHeading =
    "Are you sure you want to delete this beacon registration from your account?";
  return (
    <BeaconsForm
      previousPageUrl={previousPageURL}
      pageHeading="Are you sure you want to delete this beacon registration from your account?"
      showCookieBanner={showCookieBanner}
    >
      <FormFieldset>
        <FormLegend>Tell us why</FormLegend>
        <FormGroup>
          <RadioList>
            <RadioListItem
              id="sold"
              value="sold"
              label="I have sold this beacon"
            />
            <RadioListItem
              id="destroy"
              value="sold"
              label="I have sold this beacon"
            />
          </RadioList>
        </FormGroup>
      </FormFieldset>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserViewedDeleteRegistrationPage_DisplayPage(context),
    ]).execute();
  })
);

class IfUserViewedDeleteRegistrationPage_DisplayPage implements Rule {
  private context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
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
        previousPageURL: PageURLs.accountHome,
        registration: registrationToBeDeleted,
        showCookieBanner: true,
      },
    };
  }
}

export default DeleteRegistration;
