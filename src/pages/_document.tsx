import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { DocumentInitialProps } from "next/dist/next-server/lib/utils";

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
      <Html className={"govuk-template "}>
        <Head>
          <title>
            Maritime & Coastguard Agency - Beacons registration service
          </title>
        </Head>
        <body className={"govuk-template__body"}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GovUKTemplate;
