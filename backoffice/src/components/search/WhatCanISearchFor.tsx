import { HelpOutline } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { FeedbackButton } from "../FeedbackButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export function WhatCanISearchFor() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} startIcon={<HelpOutline />}>
        What can I search for?
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          What can I search for?
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            You can search for beacons using:
          </Typography>
          <Typography gutterBottom>
            <ul>
              <li>Hex ID</li>
              <li>Cospas-Sarsat Number</li>
              <li>MMSI number</li>
              <li>VHF call sign</li>
              <li>Vessel name</li>
              <li>Aircraft tail number</li>
              <li>Aircraft 24-bit hex address</li>
            </ul>
          </Typography>
          <Typography gutterBottom>
            <strong>Do you need to search using other information?</strong>
          </Typography>
          <Typography gutterBottom>
            <p>We would be grateful for your feedback.</p>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <FeedbackButton />
            <Button
              autoFocus
              onClick={handleClose}
              variant="contained"
              disableElevation
            >
              Back to search
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
