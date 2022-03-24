import * as React from "react";
import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import {
  SearchMode,
  updateSearchMode,
  useUserSettings,
} from "../../UserSettings";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ToggleButton, ToggleButtonGroup } from "@mui/lab";
import { FeedbackButton } from "../FeedbackButton";
import { useLocation } from "react-router";
import { AuthenticatedDownloadLink } from "../AuthenticatedDownloadLink";
import { applicationConfig } from "../../config";

export function SettingsDrawer() {
  const location = useLocation();
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
          {location.pathname.includes("export") && (
            <React.Fragment>
              <Typography
                gutterBottom={true}
                component={"p"}
                variant={"subtitle2"}
                id="feedback"
              >
                Export
              </Typography>
              <AuthenticatedDownloadLink
                url={`${applicationConfig.apiUrl}/export/excel`}
                filename={
                  "Beacons_data_export--Official_Sensitive-Personal.csv"
                }
              >
                <Button color="inherit" variant="outlined" fullWidth>
                  Export to Excel
                </Button>
              </AuthenticatedDownloadLink>
            </React.Fragment>
          )}
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
