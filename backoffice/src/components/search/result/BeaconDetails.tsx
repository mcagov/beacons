import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Field } from "./Field";

export function BeaconDetails({
  cospasSarsatNumber,
  lastModifiedDate,
}: Pick<
  BeaconSearchResult,
  "cospasSarsatNumber" | "lastModifiedDate"
>): JSX.Element {
  return (
    <React.Fragment>
      <Field
        name={"Last Modified"}
        value={lastModifiedDate.toLocaleDateString("en-GB")}
      />
      <Field name={"Cospas-Sarsat number"} value={cospasSarsatNumber} />
    </React.Fragment>
  );
}
