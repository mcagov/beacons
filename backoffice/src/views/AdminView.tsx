import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { AuthenticatedPOSTButton } from "../components/AuthenticatedPOSTButton";
import { PageContent } from "../components/layout/PageContent";
import { applicationConfig } from "../config";

export const AdminView = (): JSX.Element => {
  return (
    <PageContent>
      <Box sx={{ pl: 2, pr: 2 }}>
        <Typography
          gutterBottom={true}
          component={"p"}
          variant={"subtitle2"}
          id="feedback"
        ></Typography>
        <AuthenticatedPOSTButton
          uri={`${applicationConfig.apiUrl}/export/xlsx`}
        >
          Trigger export job
        </AuthenticatedPOSTButton>
        <Typography
          gutterBottom={true}
          component={"p"}
          variant={"subtitle2"}
          id="feedback"
        ></Typography>
        <AuthenticatedPOSTButton
          uri={`${applicationConfig.apiUrl}/export/xlsx/backup`}
        >
          Trigger backup job
        </AuthenticatedPOSTButton>
        <Typography
          gutterBottom={true}
          component={"p"}
          variant={"subtitle2"}
          id="feedback"
        ></Typography>
        <AuthenticatedPOSTButton
          uri={`${applicationConfig.apiUrl}/search/job/reindexSearch`}
        >
          Trigger re-index search job
        </AuthenticatedPOSTButton>
      </Box>
    </PageContent>
  );
};
