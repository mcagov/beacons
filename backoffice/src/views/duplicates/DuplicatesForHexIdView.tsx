import React, { FunctionComponent, useEffect, useState } from "react";
import { IDuplicatesGateway } from "../../gateways/duplicates/IDuplicatesGateway";
import { IDuplicateSummary } from "../../gateways/duplicates/IDuplicatesSummaryDTO";
import { DuplicatesTable } from "../../components/duplicates/DuplicatesTables";
import { IDuplicateBeacon } from "../../entities/IDuplicateBeacon";

interface IDuplicatesForHexIdViewProps {
  hexId: string;
  duplicatesGateway: IDuplicatesGateway;
}
export const DuplicatesForHexIdView: FunctionComponent<
  IDuplicatesForHexIdViewProps
> = ({ hexId, duplicatesGateway }) => {
  const [duplicates, setDuplicates] = useState<IDuplicateBeacon[]>([]);

  useEffect((): void => {
    const getDuplicates = async () => {
      const duplicatesForHexId = await duplicatesGateway.getDuplicatesForHexId(
        hexId
      );
      setDuplicates(duplicatesForHexId);
    };

    getDuplicates();
  }, [duplicatesGateway]);

  // const summaries = duplicateSummaries.map((summary) => {
  //   return (
  //     <li>
  //       hexId:{summary.hexId}- - - - -duplicate number:{summary.numberOfBeacons}
  //     </li>
  //   );
  // });

  // if (duplicateSummaries.length > 0) {
  //   return (
  //     <div>
  //       <DuplicatesTable duplicateSummaries={duplicateSummaries} />
  //     </div>
  //   );
  // } else {
  //   return <p>foo</p>;
  // }

  return <div>Hex id is {hexId}</div>;
};
