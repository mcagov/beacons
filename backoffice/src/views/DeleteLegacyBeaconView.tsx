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
import { PageHeader } from "../components/layout/PageHeader";
import { PageContent } from "components/layout/PageContent";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import { DeleteBeaconFormValues } from "lib/DeleteBeaconFormValues";
import { BeaconDeletionReasons } from "lib/BeaconDeletionReasons";

// is there a way we can make this reuseable and pass in the different lists of reasons from outside?
// how will it know which gateway method to call?
interface IDeleteLegacyBeaconViewProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

const reasonsForLegacyDeletion: string[] = Object.values(BeaconDeletionReasons);

export const DeleteLegacyBeaconView: FunctionComponent<
  IDeleteLegacyBeaconViewProps
> = ({ beaconsGateway, beaconId }): JSX.Element => {
  const handleSave = () => console.log("Beacon deleted");
  const handleCancel = () => console.log("Cancelled deleting");

  return (
    <div>
      <PageHeader>Delete beacon</PageHeader>
      <PageContent>
        <h2>
          Are you sure you want to permanently delete this migrated record?
        </h2>
        <p>
          This will delete the beacon record, its owner(s), and all other
          associated information.
        </p>
        <h2>Please enter a reason for deleting this beacon</h2>
        <DeleteLegacyBeaconSection
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </PageContent>
    </div>
  );
};

interface DeleteLegacyBeaconFormProps
  extends FormikProps<DeleteBeaconFormValues> {
  onCancel: () => void;
}

const DeleteLegacyBeaconReasonForm = (props: DeleteLegacyBeaconFormProps) => {
  const { errors, isSubmitting, onCancel } = props;

  return (
    <>
      <Form>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Why do you want to delete this record? (Required)
          </FormLabel>
          <RadioGroup aria-label="note type" name="radio-buttons-group">
            <label>
              <Field
                as={Radio}
                type="radio"
                id="reason"
                name="reason"
                value={reasonsForLegacyDeletion[0]}
                data-testid="deletion-reason"
              />
              {reasonsForLegacyDeletion[0]}
            </label>
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

export const DeleteLegacyBeaconSection = withFormik<
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
})(DeleteLegacyBeaconReasonForm);
