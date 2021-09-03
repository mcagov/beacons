import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormHeading,
} from "../../../../components/BeaconsForm";
import { BeaconManufacturerInput } from "../../../../components/domain/formElements/BeaconManufacturerInput";
import { BeaconModelInput } from "../../../../components/domain/formElements/BeaconModelInput";
import { HexIdHelp } from "../../../../components/domain/formElements/HexIdHelp";
import { GovUKBody } from "../../../../components/Typography";
import { DraftRegistrationPageProps } from "../../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { IfUserDoesNotHaveValidSession } from "../../../../router/rules/IfUserDoesNotHaveValidSession";

interface BeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
}

const BeaconDetails: FunctionComponent<DraftRegistrationPageProps> = ({
  form,
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Beacon details";

  return (
    <BeaconsForm
      previousPageUrl={"/"}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      <BeaconsFormHeading pageHeading={pageHeading} />
      <BeaconManufacturerInput
        value={form.fields.manufacturer.value}
        errorMessages={form.fields.manufacturer.errorMessages}
      />
      <BeaconModelInput
        value={form.fields.model.value}
        errorMessages={form.fields.manufacturer.errorMessages}
      />
      <BeaconHexId hexId={form.fields.hexId.value} />
    </BeaconsForm>
  );
};

const BeaconHexId: FunctionComponent<{ hexId: string }> = ({
  hexId,
}: {
  hexId: string;
}): JSX.Element => (
  <>
    <br />
    <GovUKBody>The 15 character beacon HEX ID or UIN number</GovUKBody>
    <GovUKBody>Hex ID/UIN: {hexId}</GovUKBody>
    <HexIdHelp />
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
    ]);
  })
);

export default BeaconDetails;
