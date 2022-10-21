import React, { ReactNode } from "react";
import { AuthenticatedDownloadButton } from "../components/AuthenticatedDownloadButton";
import { AuthenticatedPOSTButton } from "../components/AuthenticatedPOSTButton";
import { PageContent } from "../components/layout/PageContent";
import { applicationConfig } from "../config";

export const AdminView = (): ReactNode => {
  return (
    <PageContent>
      <AuthenticatedDownloadButton
        url={`${applicationConfig.apiUrl}/export/xlsx/backup`}
        label={"Trigger export job"}
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
