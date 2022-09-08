import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Button, ButtonProps, Snackbar } from "@mui/material";
import React, { ChangeEvent } from "react";

export function PrintLabelButton({
  variant,
  color,
  fullWidth = false,
}: Pick<ButtonProps, "variant" | "color" | "fullWidth">) {
  const [open, setOpen] = React.useState(false);

  const fileReader = new FileReader();
  let byteArray: Uint32Array = new Uint32Array();

  async function getByteArrayFromFile(e: ChangeEvent<HTMLInputElement>) {
    const uploadedFile = (e.target.files as FileList)[0];
    console.log(uploadedFile.name);

    byteArray = new Uint32Array(await readFile(uploadedFile));
    console.log(byteArray);
  }

  function readFile(uploadedFile: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      return fileReader.readAsArrayBuffer(uploadedFile);
    });
  }

  return (
    <>
      <input type="file" onChange={(e) => getByteArrayFromFile(e)}></input>
      <Button
        color={color}
        variant={variant}
        fullWidth={fullWidth}
        component="a"
        target="_blank"
        onClick={() => {
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
