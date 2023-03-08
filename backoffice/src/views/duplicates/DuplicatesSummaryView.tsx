import React, { FunctionComponent, useEffect, useState } from "react";
import { IDuplicatesGateway } from "../../gateways/duplicates/IDuplicatesGateway";
import { IDuplicateSummary } from "../../gateways/duplicates/IDuplicatesSummaryDTO";
import { DuplicatesTable } from "../../components/duplicates/DuplicatesTables";

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
      const duplicates = await duplicatesGateway.getDuplicates(0, 20);
      setDuplicateSummaries(duplicates);
    };

    getDuplicates();
  }, [duplicatesGateway]);

  console.log(duplicateSummaries);

  const summaries = duplicateSummaries.map((summary) => {
    return (
      <li>
        hexId:{summary.hexId}- - - - -duplicate number:{summary.numberOfBeacons}
      </li>
    );
  });

  if (duplicateSummaries.length > 0) {
    return (
      <div>
        <DuplicatesTable duplicateSummaries={duplicateSummaries} />
      </div>
    );
  } else {
    return <p>foo</p>;
  }
};
