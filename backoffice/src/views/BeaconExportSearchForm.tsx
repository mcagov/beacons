import { date } from "@appbaseio/reactivesearch/lib/types";
import { Box, Button, Paper, TextField } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { FunctionComponent, useState, useEffect } from "react";
import { PageContent } from "../components/layout/PageContent";
import { Controller, useForm } from "react-hook-form";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";
import { IBeaconExport } from "../gateways/exports/IBeaconExport";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

interface BeaconExportRecordsProps {
  exportsGateway: IExportsGateway;
}

interface ExportSearchFormProps {
  name: string;
  registrationFrom: date;
  registrationTo: date;
  lastModifiedFrom: date;
  lastModifiedTo: date;
}

interface BeaconExportsProps {
  data: IBeaconExport[];
}

function FormField({ control, labelText, name, type }: any): JSX.Element {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          label={labelText}
          type={type}
          value={value || ""}
          onChange={onChange}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
}

export const BeaconExportRecordsForm: FunctionComponent<
  BeaconExportRecordsProps
> = ({ exportsGateway }): JSX.Element => {
  const classes = useStyles();

  const [data, setData] = useState<IBeaconExport[]>([]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const { handleSubmit, reset, control } = useForm();
  const onSubmit = async (formData: any) => {
    console.dir(formData);
    await exportsGateway
      .getCertificateDataForBeacons([
        "88a581c3-00c7-4986-a380-477cd6af2152",
        "2bad8f1a-39f5-47f8-83af-81d55fb63e51",
      ])
      .then(setData);

    await exportsGateway.searchExportData(formData).then(setData);
  };

  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <h1>Beacon Export Search</h1>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <FormField
              control={control}
              labelText="Registration From"
              name="registrationFrom"
              type="date"
            />
            <FormField
              control={control}
              labelText="Registration To"
              name="registrationTo"
              type="date"
            />
            <FormField
              control={control}
              labelText="Last Modified From"
              name="modifiedFrom"
              type="date"
            />
            <FormField
              control={control}
              labelText="Last Modified To"
              name="modifiedTo"
              type="date"
            />
            <FormField
              control={control}
              labelText="Owner/Account Holder"
              name="name"
              type="text"
            />

            <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
            <Button onClick={() => reset()} variant={"outlined"}>
              Reset
            </Button>
          </Box>
        </Paper>
      </PageContent>
    </div>
  );
};
