import "./delete-record.scss";
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
import { DeleteBeaconFormValues } from "lib/DeleteBeaconFormValues";

interface IDeleteBeaconViewProps {
  reasonsForDeletion: string[] | undefined;
  reasonSubmitted: any;
  cancelled: any;
}

export const DeleteBeaconView: FunctionComponent<IDeleteBeaconViewProps> = ({
  reasonsForDeletion,
  reasonSubmitted,
  cancelled,
}): JSX.Element => {
  const handleSave = async (values: DeleteBeaconFormValues) => {
    reasonSubmitted(values.reason);
  };

  const handleCancel = () => {
    cancelled(true);
  };

  return (
    <div className="delete-beacon-container">
      <h2>Are you sure you want to permanently delete this record?</h2>
      <p>
        This will delete the beacon record, its owner(s), and all other
        associated information.
      </p>
      <h2>Please enter a reason for deleting this beacon</h2>
      <DeleteBeaconSection
        onSave={handleSave}
        onCancel={handleCancel}
        reasonsForDeletion={reasonsForDeletion}
      />
    </div>
  );
};

interface DeleteBeaconFormProps extends FormikProps<DeleteBeaconFormValues> {
  onCancel: () => void;
  reasonsForDeletion: string[] | undefined;
}

const DeleteBeaconReasonForm = (props: DeleteBeaconFormProps) => {
  const { errors, isSubmitting, onCancel, reasonsForDeletion } = props;

  return (
    <>
      <Form className="delete-beacon-form">
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Why do you want to delete this record? (Required)
          </FormLabel>
          <RadioGroup aria-label="note type" name="radio-buttons-group">
            {reasonsForDeletion !== undefined &&
              reasonsForDeletion.map((r, index) => (
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
    reasonsForDeletion: string[] | undefined;
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
