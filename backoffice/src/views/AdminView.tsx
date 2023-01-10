import React from "react";
import { AuthenticatedPOSTButton } from "../components/AuthenticatedPOSTButton";
import { PageContent } from "../components/layout/PageContent";
import { applicationConfig } from "../config";

export const AdminView = (): JSX.Element => {
  return (
    <PageContent>
      <AuthenticatedPOSTButton uri={`${applicationConfig.apiUrl}/export/xlsx`}>
        Trigger export job
      </AuthenticatedPOSTButton>
      <AuthenticatedPOSTButton
        uri={`${applicationConfig.apiUrl}/export/xlsx/backup`}
      >
        Trigger backup job
      </AuthenticatedPOSTButton>
      <AuthenticatedPOSTButton
        uri={`${applicationConfig.apiUrl}/search/job/reindexSearch`}
      >
        Trigger re-index search job
      </AuthenticatedPOSTButton>
    </PageContent>
  );
};
