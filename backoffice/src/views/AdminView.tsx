import React from "react";
import { AuthenticatedDownloadButton } from "../components/AuthenticatedDownloadButton";
import { AuthenticatedPOSTButton } from "../components/AuthenticatedPOSTButton";
import { PageContent } from "../components/layout/PageContent";
import { applicationConfig } from "../config";

export const AdminView = (): JSX.Element => {
  return (
    <PageContent>
      <AuthenticatedPOSTButton uri={`${applicationConfig.apiUrl}/export/xlsx`}>
        Trigger export job
      </AuthenticatedPOSTButton>
      <AuthenticatedDownloadButton
        url={`${applicationConfig.apiUrl}/export/xlsx/backup`}
        label={"Backup export"}
        isFullWidth={true}
      />
      <AuthenticatedPOSTButton
        uri={`${applicationConfig.apiUrl}/search/job/reindexSearch`}
      >
        Trigger re-index search job
      </AuthenticatedPOSTButton>
    </PageContent>
  );
};
