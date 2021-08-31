import Image from "next/image";
import React, { FunctionComponent } from "react";
import { Details } from "../../Details";

export const HexIdHelp: FunctionComponent = (): JSX.Element => (
  <Details
    summaryText="What does the 15 character beacon HEX ID or UIN look like?"
    className="govuk-!-padding-top-2"
  >
    <Image
      src="/assets/mca_images/beacon_hex_id.png"
      alt="This image illustrates what a beacon's HEX ID or UIN number looks like on an actual
        beacon. The example HEX ID or UIN here is 1D0EA08C52FFBFF."
      height={640}
      width={960}
    />
  </Details>
);
