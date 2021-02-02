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
      <Html className="govuk-template " lang="en">
        <Head />
        <body className="govuk-template__body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GovUKTemplate;
