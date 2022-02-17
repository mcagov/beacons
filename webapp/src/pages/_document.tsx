import { DocumentInitialProps } from "next/dist/next-server/lib/utils";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";

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
