import { FunctionComponent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { PageHeader } from "../components/layout/PageHeader";
import { PageContent } from "components/layout/PageContent";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import { logToServer } from "../utils/logger";
import { IDeleteBeaconDto } from "entities/IDeleteBeaconDto";
import { BeaconDeletionReasons } from "lib/BeaconDeletionReasons";

interface IDeleteBeaconViewProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

type DeleteBeaconInputs = {
  reason: string;
};

export const DeleteBeaconView: FunctionComponent<IDeleteBeaconViewProps> = ({
  beaconsGateway,
  beaconId,
}): JSX.Element => {
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

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeleteBeaconInputs>({
    mode: "onChange",
  });
  // const routerHistory = useHistory();

  const submitReasonHandler: SubmitHandler<DeleteBeaconInputs> = async (
    formInputs
  ) => await deleteRecord(formInputs.reason);

  const deleteRecord = async (reason: string) => {
    try {
      const deleteBeaconDto: IDeleteBeaconDto = {
        beaconId: beaconId,
        deletingUserId: "",
        reason: reason,
      };
      await beaconsGateway.deleteBeacon(deleteBeaconDto);
    } catch (error) {
      logToServer.error(error);
    }
  };

  const reasonsForDeletion: string[] = Object.values(BeaconDeletionReasons);

  const reasonsSection =
    reasonsForDeletion && reasonsForDeletion.length > 0 ? (
      <div className={classes.root}>
        {reasonsForDeletion.map((r, index) => (
          <div>
            <input
              type="radio"
              value={r}
              {...register("reason", { required: true })}
            ></input>
            <label htmlFor="reason">{r}</label>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div>
      <PageHeader>Delete beacon</PageHeader>
      <PageContent>
        <h2>Are you sure you want to permanently delete this record?</h2>
        <p>
          This will delete the beacon record, its owner(s), and all other
          associated information.
        </p>
        <h2>Please enter a reason for deleting this beacon</h2>
        <form onSubmit={handleSubmit(submitReasonHandler)}>
          {reasonsSection}
          {errors.reason && "Please enter a reason for deletion"}
          <button disabled={!isValid}>Delete beacon</button>
        </form>
      </PageContent>
    </div>
  );
};
