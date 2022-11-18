import { FunctionComponent, useState } from "react";
import { PageContent } from "components/layout/PageContent";

interface IDeleteBeaconViewProps {}

export const DeleteBeaconView: FunctionComponent<
  IDeleteBeaconViewProps
> = ({}): JSX.Element => {
  function handleClick(isActionOption: boolean): void {
    setOpen(false);
    selectOption(isActionOption);
  }

  return (
    <div>
      <PageContent>
        <h2>Please enter a reason for deleting this beacon</h2>
      </PageContent>
    </div>
  );
};
