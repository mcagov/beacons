import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import * as React from "react";
import { applicationConfig } from "../../config";
import {
  SearchMode,
  updateSearchMode,
  useUserSettings,
} from "../../UserSettings";
import { OnlyVisibleToUsersWith } from "../auth/OnlyVisibleToUsersWith";
import { AuthenticatedDownloadButton } from "../AuthenticatedDownloadButton";
import { FeedbackButton } from "../FeedbackButton";

export function SettingsDrawer() {
  const [settings, dispatch] = useUserSettings();
  const [open, setOpen] = React.useState(false);

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
            />
          </OnlyVisibleToUsersWith>
          <OnlyVisibleToUsersWith role={"ADMIN_EXPORT"}>
            <div className="hidden-button">
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
            </div>
            <Typography
              gutterBottom={true}
              component={"p"}
              variant={"subtitle2"}
              id="export-search-btn"
            >
              Export Search
            </Typography>
            <Button
              href={`backoffice#/export/search`}
              variant="outlined"
              fullWidth
            >
              Beacon Export Search
            </Button>
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
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
