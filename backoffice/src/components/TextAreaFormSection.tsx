import "./delete-record.scss";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import { FunctionComponent } from "react";

interface ITextAreaFormSectionProps {
  formSectionTitle: string;
  entityToSubmit: string;
  textSubmitted: (reason: string) => void;
  cancelled: (cancelled: boolean) => void;
}

export interface TextAreaFormValues {
  text: string;
}

export const TextAreaFormSection: FunctionComponent<
  ITextAreaFormSectionProps
> = ({
  formSectionTitle,
  entityToSubmit,
  textSubmitted,
  cancelled,
}): JSX.Element => {
  const handleSave = (values: TextAreaFormValues) => {
    textSubmitted(values.text);
  };

  const handleCancel = () => {
    cancelled(true);
  };

  return (
    <div className="text-area-form-container">
      <h2>{formSectionTitle}</h2>
      <TextAreaSection
        entityToSubmit={entityToSubmit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

interface TextAreaFormProps extends FormikProps<TextAreaFormValues> {
  entityToSubmit: string;
  formQuestion: string;
  textAreaId: string;
  onCancel: () => void;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const {
    errors,
    isSubmitting,
    entityToSubmit,
    formQuestion,
    textAreaId,
    onCancel,
  } = props;

  return (
    <>
      <Form className="delete-beacon-form">
        <FormControl component="fieldset">
          <FormLabel component="legend">{formQuestion} (Required)</FormLabel>
          <Box mr={75}>
            <Field
              as={TextField}
              id="text"
              name="text"
              type="string"
              multiline
              fullWidth
              rows={4}
              data-testid={textAreaId}
            />
          </Box>
        </FormControl>
        <Box mt={2} mr={2}>
          <Button
            name="save"
            type="submit"
            color="secondary"
            data-testid="save"
            variant="contained"
            disabled={isSubmitting || !!errors.text}
          >
            Submit {entityToSubmit}
          </Button>
          <Button name="cancel" onClick={onCancel} data-testid="cancel">
            Cancel
          </Button>
        </Box>
      </Form>
    </>
  );
};

export const TextAreaSection = withFormik<
  {
    entityToSubmit: string;
    onSave: (text: TextAreaFormValues) => void;
    onCancel: () => void;
  },
  TextAreaFormValues
>({
  mapPropsToErrors: () => {
    return {
      text: "Required",
    };
  },

  validate: (values: TextAreaFormValues) => {
    let errors: FormikErrors<TextAreaFormValues> = {};
    if (!values.text) {
      errors.text = "Required";
    }
    return errors;
  },

  handleSubmit: (values: TextAreaFormValues, { setSubmitting, props }) => {
    props.onSave(values);
    setSubmitting(false);
  },
})(TextAreaForm);
