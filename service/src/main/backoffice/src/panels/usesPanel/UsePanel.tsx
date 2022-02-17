import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Environments, IUse } from "entities/IUse";
import React, { FunctionComponent, ReactNode } from "react";
import { formatUse } from "utils/writingStyle";
import { AviationUse } from "./AviationUse";
import { LandUse } from "./LandUse";
import { MaritimeUse } from "./MaritimeUse";

interface UseSummaryPanelProps {
  use: IUse;
  titlePrefix: string;
}

export const UsePanel: FunctionComponent<UseSummaryPanelProps> = ({
  use,
  titlePrefix,
}: UseSummaryPanelProps): JSX.Element => {
  return (
    <Card>
      <CardContent>
        <CardHeader title={cardHeaderTitle(titlePrefix, use)} />
        {useSummary(use)}
      </CardContent>
    </Card>
  );
};

const cardHeaderTitle = (titlePrefix: string, use: IUse): string => {
  const usePrefix = `${titlePrefix} use: `;
  const useOverview = formatUse(use).toUpperCase();

  return usePrefix + useOverview;
};

const useSummary = (use: IUse): ReactNode => {
  switch (use.environment) {
    case Environments.Maritime:
      return <MaritimeUse use={use} />;

    case Environments.Aviation:
      return <AviationUse use={use} />;

    case Environments.Land:
      return <LandUse use={use} />;
  }
};
