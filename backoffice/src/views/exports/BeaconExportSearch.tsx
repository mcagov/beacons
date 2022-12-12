import { date } from "@appbaseio/reactivesearch/lib/types";
import { Box, Button, Paper, TextField } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../../components/layout/PageContent";
import { Controller, useForm } from "react-hook-form";
import { IExportsGateway } from "../../gateways/exports/IExportsGateway";
import { ExportBeaconsTable } from "components/export/ExportBeaconsTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface BeaconExportRecordsProps {
  exportsGateway: IExportsGateway;
}

export interface ExportSearchFormProps {
  name: string;
  registrationFrom: Date;
  registrationTo: Date;
  lastModifiedFrom: Date;
  lastModifiedTo: Date;
  page: number;
  pageSize: number;
}

export interface IBeaconExportSearchResult {
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _embedded: { beaconSearch: IBeaconExportResult[] };
}

export interface IBeaconExportResult {
  id: string;
  createdDate: Date;
  lastModifiedDate: Date;
  beaconStatus: string;
  hexId: string;
  ownerName: string;
  ownerEmail: string;
  accountHolderId: string;
  accountHolderName: string;
  accountHolderEmail: string;
  useActivities: string;
  beaconType: string;
  manufacturerSerialNumber: string;
  cospasSarsatNumber: string;
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

export const BeaconExportSearch: FunctionComponent<
  BeaconExportRecordsProps
> = ({ exportsGateway }): JSX.Element => {
  const classes = useStyles();

  const [result, setResult] = useState<IBeaconExportSearchResult>(
    {} as IBeaconExportSearchResult
  );
  const [form, setForm] = useState<any>({});
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  const { handleSubmit, reset, control } = useForm();
  const onSubmit = async (formData: any) => {
    formData.page = page;
    formData.pageSize = pageSize;
    setForm(formData);

    await exportsGateway.searchExportData(formData).then(setResult);
  };

  useEffect(() => {
    onSubmit(form);
  }, [page, pageSize]);

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
              name="lastModifiedFrom"
              type="date"
            />
            <FormField
              control={control}
              labelText="Last Modified To"
              name="lastModifiedTo"
              type="date"
            />
            <FormField
              control={control}
              labelText="Owner/Account Holder"
              name="name"
              type="text"
            />

            <Button
              onClick={handleSubmit(onSubmit)}
              variant={"outlined"}
              className={classes.button}
            >
              Search
            </Button>
            <Button
              onClick={() => reset()}
              variant={"outlined"}
              className={classes.button}
            >
              Clear
            </Button>
          </Box>
          <ExportBeaconsTable
            result={result}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </Paper>
      </PageContent>
    </div>
  );
};