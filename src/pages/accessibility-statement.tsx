import Image from "next/image";
import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import {
  AnchorLink,
  GovUKBody,
  GovUKBulletedList,
  PageHeading,
  SectionHeading,
} from "../components/Typography";

const AccessibilityStatementPage: FunctionComponent = () => {
  const pageHeading = "Accessibility statement";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <GovUKBody>
              This website is run by the Beacons Registry Team with support from{" "}
              <AnchorLink href={"https://www.madetech.com/"}>
                Made Tech
              </AnchorLink>
              .
            </GovUKBody>
            <GovUKBody>
              It is designed to be used by as many people as possible. The text
              should be clear and simple to understand.
            </GovUKBody>
            <GovUKBody>You should be able to:</GovUKBody>
            <GovUKBulletedList>
              <li>zoom in up to 300% without problems</li>
              <li>navigate most of the website using just a keyboard</li>
              <li>
                navigate most of the website using speech recognition software
              </li>
              <li>
                use most of the website using a screen reader (including the
                most recent versions of JAWS, NVDA and VoiceOver)
              </li>
            </GovUKBulletedList>
            <GovUKBody>
              We have also made the website text as simple as possible to
              understand.
            </GovUKBody>
            <GovUKBody>
              <AnchorLink href="https://abilitynet.org.uk/">
                AbilityNet
              </AnchorLink>{" "}
              has advice on making your device easier to use if you have a
              disability.
            </GovUKBody>
            <SectionHeading>Feedback and contact information</SectionHeading>
            <GovUKBody>
              If you need information on this website in a different format,
              then contact the beacons team for assistance.
            </GovUKBody>
            <GovUKBulletedList>
              <li>
                email us at{" "}
                <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
                  ukbeacons@mcga.gov.uk
                </AnchorLink>
              </li>
              <li>call us on 02038 172006</li>
            </GovUKBulletedList>
            <GovUKBody>In your message, include:</GovUKBody>
            <GovUKBulletedList>
              <li>the web address (URL) of the content</li>
              <li>your email address and name</li>
              <li>the format you need</li>
            </GovUKBulletedList>
            <GovUKBody>
              We’ll consider your request and get back to you in 5 working days.
            </GovUKBody>
            <SectionHeading>
              Reporting accessibility problems with this website
            </SectionHeading>
            <GovUKBody>
              If you have any accessibility query including:
            </GovUKBody>
            <GovUKBulletedList>
              <li>Issues with accessing information or using this website</li>
              <li>An accessibility problem not listed on this statement</li>
              <li>Any positive feedback about this website’s accessibility</li>
            </GovUKBulletedList>
            <GovUKBody>
              We’re always looking to improve the accessibility of this website.
              If you find any problems not listed on this page or think we’re
              not meeting accessibility requirements, contact{" "}
              <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
                ukbeacons@mcga.gov.uk
              </AnchorLink>
            </GovUKBody>
            <SectionHeading>Enforcement procedure</SectionHeading>
            <GovUKBody>
              The Equality and Human Rights Commission (EHRC) is responsible for
              enforcing the Public Sector Bodies (Websites and Mobile
              Applications) (No. 2) Accessibility Regulations 2018 (the
              &apos;accessibility regulations&apos;). If you’re not happy with
              how we respond to your complaint, contact the Equality Advisory
              and Support Service (EASS).
            </GovUKBody>
            <SectionHeading>
              Technical information about this website’s accessibility
            </SectionHeading>
            <GovUKBody>
              The MCA Beacons Registry Team is committed to making its website
              accessible, in accordance with the Public Sector Bodies (Websites
              and Mobile Applications) (No. 2) Accessibility Regulations 2018.{" "}
            </GovUKBody>
            <SectionHeading>Compliance status</SectionHeading>
            <GovUKBody>
              This website is fully compliant with the Web Content Accessibility
              Guidelines version 2.1 AA standard.
            </GovUKBody>
            <SectionHeading>Usability restrictions</SectionHeading>
            <GovUKBody>
              The features listed below have restricted usability for the
              following reasons. Error suggestions on the &apos;Create a Beacon
              Registry Account - GOV.UK&apos; page are not specific of the error
              that has occurred. This fails 3.3.3 Error Suggestion (Level AA).
              However, this page belongs to a third party which is beyond the
              Maritime and Coastguard Agency&apos;s control.
            </GovUKBody>
            <GovUKBody>
              Some users found some link text difficult to read due to the low
              contrast of foreground and background colours (foreground:
              #1d70b8; background: #FFFFFF; point size: 12pt; weight: normal).
              The expected minimum colour contrast ratio for text of this size
              and weight is 7:1. This fails 1.4.6 Contrast (Enhanced) (Level
              AAA)
            </GovUKBody>
            <SectionHeading>
              What we’re doing to improve accessibility
            </SectionHeading>
            <GovUKBody>
              Content and features will be regularly reviewed and improved to
              ensure continued accessibility.
            </GovUKBody>
            <SectionHeading>
              Preparation of this accessibility statement
            </SectionHeading>
            <GovUKBody>
              This statement was prepared on 29th September 2021.
              <br />
            </GovUKBody>
            <GovUKBody>
              This website was tested and certified on 16 September 2021. The
              test and review was carried out by the{" "}
              <AnchorLink href={"https://digitalaccessibilitycentre.org/"}>
                Digital Accessibility Centre
              </AnchorLink>
              .
            </GovUKBody>
            <Image
              src="/assets/images/dac_certification.png"
              alt="Digital Accessibility Centre certification with two ticks"
              height="103"
              width="181"
            />
          </>
        }
      />
    </Layout>
  );
};

export default AccessibilityStatementPage;
