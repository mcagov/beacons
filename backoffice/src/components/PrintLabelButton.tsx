import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Button, ButtonProps, Snackbar } from "@mui/material";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import React from "react";

export function PrintLabelButton({
  exportsGateway,
  variant,
  color,
  fullWidth = false,
}: { exportsGateway: IExportsGateway } & Pick<
  ButtonProps,
  "variant" | "color" | "fullWidth"
>) {
  const [open, setOpen] = React.useState(false);

  async function printLabel() {
    // will be better to refactor this later so the SingleBeaconRecordView or a separate panel
    // to be passed in from outside
    const beaconId = "666";
    const labelToPrint = await exportsGateway.getPdfLabel(beaconId);
  }

  return (
    <>
      <Button
        color={color}
        variant={variant}
        fullWidth={fullWidth}
        component="a"
        target="_blank"
        onClick={() => {
          printLabel();
          setOpen(true);
        }}
        endIcon={<PrintRoundedIcon />}
      >
        Print label
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={"File ready to print"}
      />
    </>
  );
}
