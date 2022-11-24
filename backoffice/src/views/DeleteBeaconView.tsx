import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import { FunctionComponent } from "react";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import { IDeleteBeaconDto } from "entities/IDeleteBeaconDto";
import { DeleteBeaconFormValues } from "lib/DeleteBeaconFormValues";
import { BeaconDeletionReasons } from "lib/BeaconDeletionReasons";

interface IDeleteBeaconViewProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

const reasonsForDeletion: string[] = Object.values(BeaconDeletionReasons);

export const DeleteBeaconView: FunctionComponent<IDeleteBeaconViewProps> = ({
  beaconsGateway,
  beaconId,
}): JSX.Element => {
  const handleSave = async (values: DeleteBeaconFormValues) => {
    await deleteRecord(values.reason);
    // emit event to parent saying it's been saved
  };

  const deleteRecord = async (reason: string) => {
    const deleteLegacyBeaconDto: IDeleteBeaconDto = {
      beaconId: beaconId,
      accountHolderId: undefined,
      reason: reason,
    };
    await beaconsGateway.deleteBeacon(deleteLegacyBeaconDto);
  };

  const handleCancel = () => console.log("cancel"); // emit event to parent saying cancelled

  return (
    <div>
      <h2>Are you sure you want to permanently delete this record?</h2>
      <p>
        This will delete the beacon record, its owner(s), and all other
        associated information.
      </p>
      <h2>Please enter a reason for deleting this beacon</h2>
      <DeleteBeaconSection onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

interface DeleteBeaconFormProps extends FormikProps<DeleteBeaconFormValues> {
  onCancel: () => void;
}

const DeleteBeaconReasonForm = (props: DeleteBeaconFormProps) => {
  const { errors, isSubmitting, onCancel } = props;

  return (
    <>
      <Form>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Why do you want to delete this record? (Required)
          </FormLabel>
          <RadioGroup aria-label="note type" name="radio-buttons-group">
            {reasonsForDeletion.map((r, index) => (
              <label key={index}>
                <Field
                  as={Radio}
                  type="radio"
                  id="reason"
                  name="reason"
                  value={r}
                  data-testid="deletion-reason"
                />
                {r}
              </label>
            ))}
          </RadioGroup>
        </FormControl>
        <Box mt={2} mr={2}>
          <Button
            name="save"
            type="submit"
            color="secondary"
            data-testid="save"
            variant="contained"
            disabled={isSubmitting || !!errors.reason}
          >
            Delete beacon
          </Button>
          <Button name="cancel" onClick={onCancel} data-testid="cancel">
            Cancel
          </Button>
        </Box>
      </Form>
    </>
  );
};

export const DeleteBeaconSection = withFormik<
  {
    onSave: (reason: DeleteBeaconFormValues) => void;
    onCancel: () => void;
  },
  DeleteBeaconFormValues
>({
  mapPropsToErrors: () => {
    return {
      reason: "Required",
    };
  },

  validate: (values: DeleteBeaconFormValues) => {
    let errors: FormikErrors<DeleteBeaconFormValues> = {};
    if (!values.reason) {
      errors.reason = "Required";
    }
    return errors;
  },

  handleSubmit: (values: DeleteBeaconFormValues, { setSubmitting, props }) => {
    props.onSave(values);
    setSubmitting(false);
  },
})(DeleteBeaconReasonForm);
