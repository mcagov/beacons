import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { DocumentInitialProps } from "next/dist/next-server/lib/utils";
import { Header } from "../components/Header";
import { PhaseBanner } from "../components/PhaseBanner";
import { Footer } from "../components/Footer";

class GovUKTemplate extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): React.ReactElement {
    return (
      // TODO: https://github.com/madetech/mca-beacons-webapp/issues/25
      <Html className={"govuk-template "} lang={"en"}>
        <Head />
        <body className={"govuk-template__body"}>
          <Header serviceName={"Beacon registration service"} homeLink={"#"} />
          <PhaseBanner
            phase={"BETA"}
            bannerHtml={
              <>
                This is a new MCA Show and Tell on 29 January 2021 – your{" "}
                <a className="govuk-link" href="#">
                  feedback
                </a>{" "}
                will help us to improve it.
              </>
            }
          />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GovUKTemplate;
