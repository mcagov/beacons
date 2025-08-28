import React, { FunctionComponent, type JSX } from "react";
import Image from "next/image";
import { Details } from "./Details";
import { AnchorLink, GovUKList } from "./Typography";

interface BeaconRegistryContactInfoProps {
  h2?: boolean;
}

export const McaLogo: FunctionComponent = (): JSX.Element => (
  <>
    <a className="govuk-body govuk-!-margin-bottom-3" href="https://gov.uk/mca">
      <Image
        src="/assets/mca_images/mca-logo.png"
        alt="This image illustrates the Maritime & Coastguard Agency logo."
        height={178}
        width={200}
      />
    </a>
  </>
);

export const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <BeaconRegistryContactInfo h2 />
    <p className="govuk-!-margin-top-5">
      In an emergency situation please call UK Emergency Services, 24/7 UK Tels:
      999 or 112
    </p>
  </Details>
);

export const BeaconRegistryContactInfo: FunctionComponent<
  BeaconRegistryContactInfoProps
> = ({ h2 = false }: BeaconRegistryContactInfoProps): JSX.Element => (
  <div>
    {h2 ? (
      <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
        The UK Beacon Registry
      </h2>
    ) : (
      <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
        The UK Beacon Registry
      </h3>
    )}
    <GovUKList>
      <li>
        <a className="govuk-link" href="mailto:ukbeacons@mcga.gov.uk">
          ukbeacons@mcga.gov.uk
        </a>
        : this is the quickest way to contact us
      </li>
      <li>Telephone: +44 (0)20 3817 2006</li>
      <li>Fax: +44 (0)1326 319264</li>
      <li>Monday to Friday, 9am to 5pm (except public holidays)</li>
      <li>
        <AnchorLink href="https://www.gov.uk/call-charges">
          Find out about call charges
        </AnchorLink>
      </li>
    </GovUKList>
  </div>
);
