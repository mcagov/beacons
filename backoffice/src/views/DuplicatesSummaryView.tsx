import React, { FunctionComponent, useEffect, useState } from "react";
import { IDuplicatesGateway } from "../gateways/duplicates/IDuplicatesGateway";
import { IDuplicateSummary } from "../gateways/duplicates/IDuplicatesSummaryDTO";

interface IDuplicatesSummaryProps {
  duplicatesGateway: IDuplicatesGateway;
}
export const DuplicateSummaryView: FunctionComponent<
  IDuplicatesSummaryProps
> = ({ duplicatesGateway }) => {
  const [duplicateSummaries, setDuplicateSummaries] = useState<
    IDuplicateSummary[]
  >([]);

  useEffect((): void => {
    const getDuplicates = async () => {
      const duplicates = await duplicatesGateway.getDuplicates();
      setDuplicateSummaries(duplicates);
    };

    getDuplicates();
  }, [duplicatesGateway]);

  console.log(duplicateSummaries);

  return <p>Bababooey</p>;
};
