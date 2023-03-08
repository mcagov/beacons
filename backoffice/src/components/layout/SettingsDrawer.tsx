import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import { AuthenticatedDownloadButton } from "components/AuthenticatedDownloadButton";
import { applicationConfig } from "config";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  SearchMode,
  updateSearchMode,
  useUserSettings,
} from "../../UserSettings";
import { OnlyVisibleToUsersWith } from "../auth/OnlyVisibleToUsersWith";
import { FeedbackButton } from "../FeedbackButton";

interface ISettingsDrawerProps {
  exportsGateway: IExportsGateway;
}

export const SettingsDrawer: React.FunctionComponent<ISettingsDrawerProps> = ({
  exportsGateway,
}): JSX.Element => {
  const [settings, dispatch] = useUserSettings();
  const [open, setOpen] = React.useState(false);
  const [showProgressCircle, setShowProgressCirlce] = React.useState(false);

  const toggleDrawer = () => {
    setOpen((open) => !open);
  };

  const handleSelectSearchMode = (
    event: React.MouseEvent<HTMLElement>,
    searchMode: SearchMode | null
  ) => {
    if (searchMode != null) {
      updateSearchMode(dispatch, searchMode);
    }
  };

  const handleDownloadStarted = () => {
    setShowProgressCirlce(true);
  };

  const handleDownloadComplete = (complete: boolean) => {
    setShowProgressCirlce(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={toggleDrawer} color={"inherit"}>
        <SettingsIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: "0.25rem 0 0.25rem 0", width: 300 } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          padding="1rem"
          role="presentation"
          alignItems="center"
        >
          <Typography component="p" sx={{ fontWeight: 500, letterSpacing: 0 }}>
            Settings
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            size={"small"}
            sx={{ marginRight: "-0.75rem" }}
          >
            <Close fontSize="small" color="secondary" />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ pl: 2, pr: 2 }}>
          <Typography
            gutterBottom={true}
            component={"p"}
            variant={"subtitle2"}
            id="settings-search-mode"
          >
            Search Mode
          </Typography>
          <ToggleButtonGroup
            value={settings.searchMode}
            onChange={handleSelectSearchMode}
            fullWidth
            exclusive
            aria-labelledby="settings-search-mode"
          >
            <ToggleButton value="default" aria-label="default search">
              Default
            </ToggleButton>
            <ToggleButton value="advanced" aria-label="advanced search">
              Advanced
            </ToggleButton>
          </ToggleButtonGroup>
          {/* TODO - Remove once Backup Contingency open to SAR. */}
          <OnlyVisibleToUsersWith role={"DATA_EXPORTER"}>
            <Typography
              gutterBottom={true}
              component={"p"}
              variant={"subtitle2"}
              id="feedback"
            >
              Export
            </Typography>
            <AuthenticatedDownloadButton
              label="Export to Excel"
              url={`${applicationConfig.apiUrl}/export/xlsx`}
              isFullWidth={true}
              downloadStarted={handleDownloadStarted}
              downloadComplete={handleDownloadComplete}
            />
          </OnlyVisibleToUsersWith>
          <OnlyVisibleToUsersWith role={"ADMIN_EXPORT"}>
            <Typography
              gutterBottom={true}
              component={"p"}
              variant={"subtitle2"}
              id="feedback"
            >
              Backup
            </Typography>
            <AuthenticatedDownloadButton
              label="Backup export"
              url={`${applicationConfig.apiUrl}/export/xlsx/backup`}
              isFullWidth={true}
              downloadStarted={handleDownloadStarted}
              downloadComplete={handleDownloadComplete}
            />
          </OnlyVisibleToUsersWith>
          <Typography
            gutterBottom={true}
            component={"p"}
            variant={"subtitle2"}
            id="feedback"
          >
            Feedback
          </Typography>
          <FeedbackButton variant={"outlined"} color={"inherit"} fullWidth />
          <OnlyVisibleToUsersWith role={"DELETE_BEACONS"}>
            <Typography
              gutterBottom={true}
              component={"p"}
              variant={"subtitle2"}
              id="duplicate-records"
            >
              Duplicates
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth={true}
              component={RouterLink}
              to="/duplicates"
            >
              Duplicate records
            </Button>
          </OnlyVisibleToUsersWith>
        </Box>
        {showProgressCircle && (
          <CircularProgress id="download-progress-circle" />
        )}
      </Drawer>
    </React.Fragment>
  );
};
