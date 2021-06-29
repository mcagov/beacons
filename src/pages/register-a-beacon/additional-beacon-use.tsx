import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { SectionHeading } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { FormCacheFactory, FormSubmission } from "../../lib/formCache";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
  setFormCache,
} from "../../lib/middleware";
import {
  AdditionalUses,
  BeaconUse,
  Environment,
} from "../../lib/registration/types";
import { PageURLs } from "../../lib/urls";
import {
  formatUrlQueryParams,
  makeEnumValueUserFriendly,
  sentenceCase,
  useRankString,
} from "../../lib/utils";

const definePageForm = ({
  additionalBeaconUse,
}: FormSubmission): FormManager => {
  return new FormManager({
    additionalBeaconUse: new FieldManager(additionalBeaconUse, [
      //Validators.required("Additional beacon use is a required field"),
    ]),
  });
};

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  registration,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const previousPageUrl = "/register-a-beacon/more-details";
  const pageHeading = "Summary of how you use this beacon";
  const additionalBeaconName = "additionalBeaconUse";

  const useSections = [];
  for (const [index, use] of registration.uses.entries()) {
    useSections.push(
      <BeaconUseSection index={index} use={use} key={`row${index}`} />
    );
  }

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={previousPageUrl}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
      errorMessages={form.fields.additionalBeaconUse.errorMessages}
    >
      {useSections}

      <button
        role="button"
        draggable="false"
        className="govuk-button govuk-button--secondary"
        data-module="govuk-button"
        type="submit"
        name={additionalBeaconName}
        value={AdditionalUses.YES}
      >
        Add another use for this beacon
      </button>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = async (
  context: BeaconsContext
) => {
  const shouldCreateAdditionalUse =
    context.formData.additionalBeaconUse === "true";
  if (shouldCreateAdditionalUse) {
    const registration = await FormCacheFactory.getCache().get(
      context.submissionId
    );
    registration.createUse();
    await setFormCache(context.submissionId, registration);

    const useIndex = registration.getRegistration().uses.length - 1;

    return formatUrlQueryParams("/register-a-beacon/beacon-use", { useIndex });
  } else {
    return "/register-a-beacon/about-beacon-owner";
  }
};

interface BeaconUseSectionProps {
  index: number;
  use: BeaconUse;
  href?: string;
}

const BeaconUseSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.environment}?useIndex=${index}`;
  let aboutTheSection = <></>;
  let commsSection = <></>;
  switch (use.environment) {
    case Environment.MARITIME:
      aboutTheSection = <AboutTheVesselSubSection index={index} use={use} />;
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={PageURLs.vesselCommunications}
        />
      );
      break;
    case Environment.AVIATION:
      aboutTheSection = <AboutTheAircraftSubSection index={index} use={use} />;
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={PageURLs.aircraftCommunications}
        />
      );
      break;
    case Environment.LAND:
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={PageURLs.landCommunications}
        />
      );
      break;
  }
  return (
    <>
      <SectionHeading>
        {sentenceCase(useRankString(index + 1))} use:{" "}
        {makeEnumValueUserFriendly(use.activity)} (
        {makeEnumValueUserFriendly(use.purpose)})
      </SectionHeading>

      {aboutTheSection}
      {commsSection}
      <MoreDetailsSubSection index={index} use={use} />
    </>
  );
};

const AboutTheVesselSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.aboutTheVessel}?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="About the vessel, rig or windfarm">
          {use.vesselName && (
            <BeaconUseDataRowItem label="Name" value={use.vesselName} />
          )}
          <BeaconUseDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          {use.beaconLocation && (
            <BeaconUseDataRowItem
              label="Beacon position"
              value={use.beaconLocation}
            />
          )}
          {use.homeport && (
            <BeaconUseDataRowItem label="Homeport" value={use.homeport} />
          )}
          {use.areaOfOperation && (
            <BeaconUseDataRowItem
              label="Area of operation"
              value={use.areaOfOperation}
            />
          )}
          {use.portLetterNumber && (
            <BeaconUseDataRowItem
              label="Port letter number"
              value={use.portLetterNumber}
            />
          )}
          {use.imoNumber && (
            <BeaconUseDataRowItem label="IMO number" value={use.imoNumber} />
          )}
          {use.ssrNumber && (
            <BeaconUseDataRowItem
              label="Small Ships Register number"
              value={use.ssrNumber}
            />
          )}
          {use.rssNumber && (
            <BeaconUseDataRowItem
              label=" Registry of Shipping and Seamen (RSS) number"
              value={use.rssNumber}
            />
          )}
          {use.officialNumber && (
            <BeaconUseDataRowItem
              label="Official number"
              value={use.officialNumber}
            />
          )}
          {use.rigPlatformLocation && (
            <BeaconUseDataRowItem
              label="Windfarm, rig or platform location"
              value={use.rigPlatformLocation}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const AboutTheAircraftSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.aboutTheAircraft}?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="About the aircraft">
          <BeaconUseDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          <BeaconUseDataRowItem
            label="Manufacture and model: "
            value={use.aircraftManufacturer}
          />
          <BeaconUseDataRowItem
            label="Principal airport"
            value={use.principalAirport}
          />
          <BeaconUseDataRowItem
            label="Secondary airport"
            value={use.secondaryAirport}
          />
          <BeaconUseDataRowItem
            label="Registration mark"
            value={use.registrationMark}
          />
          <BeaconUseDataRowItem label="24-bit HEX" value={use.hexAddress} />
          <BeaconUseDataRowItem
            label="CORE/Serial number"
            value={use.cnOrMsnNumber}
          />
          {use.dongle && (
            <BeaconUseDataRowItem label="Is this a dongle?" value="Yes" />
          )}
          <BeaconUseDataRowItem
            label="Beacon position"
            value={use.beaconPosition}
          />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const CommunicationsSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
  href,
}: BeaconUseSectionProps): JSX.Element => {
  href = `${href}?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="Communications">
          {use.environment === Environment.MARITIME && (
            <BeaconUseDataRowItem label="Callsign" value={use.callSign} />
          )}
          {use.fixedVhfRadio.includes("true") && (
            <>
              Fixed VHF/DSC
              <br />
            </>
          )}
          {use.fixedVhfRadio.includes("true") && use.fixedVhfRadioInput && (
            <BeaconUseDataRowItem label="MMSI" value={use.fixedVhfRadioInput} />
          )}
          {use.vhfRadio.includes("true") && (
            <>
              VHF Radio
              <br />
            </>
          )}
          {use.portableVhfRadio.includes("true") && (
            <>
              Portable VHF/DSC
              <br />
            </>
          )}
          {use.portableVhfRadio.includes("true") &&
            use.portableVhfRadioInput && (
              <BeaconUseDataRowItem
                label="Portable MMSI"
                value={use.portableVhfRadioInput}
              />
            )}
          {use.mobileTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Mobile telephone (1)"
              value={use.mobileTelephoneInput1}
            />
          )}
          {use.mobileTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Mobile telephone (2)"
              value={use.mobileTelephoneInput2}
            />
          )}
          {use.satelliteTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Satellite telephone"
              value={use.satelliteTelephoneInput}
            />
          )}
          {use.otherCommunication.includes("true") && (
            <BeaconUseDataRowItem
              label="Other communication"
              value={use.otherCommunicationInput}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const MoreDetailsSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.moreDetails}?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="More details">
          <BeaconUseDataRowItem value={use.moreDetails} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

interface CheckYourAnswersDataRowItemProps {
  label?: string;
  value?: string;
}

const BeaconUseDataRowItem: FunctionComponent<CheckYourAnswersDataRowItemProps> =
  ({ label, value }: CheckYourAnswersDataRowItemProps): JSX.Element => (
    <>
      {label ? label + ": " : ""}
      {value ? value : ""}
      <br />
    </>
  );

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  definePageForm,
  async (context: GetServerSidePropsContext) => {
    const decoratedContext = await decorateGetServerSidePropsContext(context);

    return {
      props: { registration: decoratedContext.registration.registration },
    };
  },
  onSuccessfulFormCallback
);

export default AdditionalBeaconUse;
