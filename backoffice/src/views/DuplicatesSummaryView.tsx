import React, {
  forwardRef,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
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
  return <p>Bababooey</p>;
};
