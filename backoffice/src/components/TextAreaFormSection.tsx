import "./text-area-form.scss";
import { Box, Button, FormControl, TextField } from "@mui/material";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import { FunctionComponent } from "react";

interface ITextAreaFormSectionProps {
  formSectionTitle?: string;
  entityToSubmit: string;
  textSubmitted: (reason: string) => void;
  cancelled: (cancelled: boolean) => void;
}

interface TextAreaFormValues {
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
    console.log(values.text);
    textSubmitted(values.text);
  };

  const handleCancel = () => {
    cancelled(true);
  };

  return (
    <div className="text-area-form-container">
      {formSectionTitle && <h2>{formSectionTitle}</h2>}
      <TextAreaSection
        entityToSubmit={entityToSubmit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

interface TextAreaFormProps extends FormikProps<TextAreaFormValues> {
  onCancel: () => void;
  entityToSubmit: string;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const { errors, isSubmitting, entityToSubmit, onCancel } = props;

  return (
    <>
      <Form className="textarea-form">
        <FormControl component="fieldset" fullWidth>
          <Box>
            <Field
              as={TextField}
              id="text"
              name="text"
              type="string"
              multiline
              fullWidth
              rows={11}
              data-testid={`${entityToSubmit}-text`}
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
    onSave: (text: TextAreaFormValues) => void;
    onCancel: () => void;
    entityToSubmit: string;
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
    if (values.text) {
      // turn into regex to exclude any code and uppercase letters
      // show the error text
      const textHasInvalidChars =
        values.text.includes("<") ||
        values.text.includes(">") ||
        values.text.includes("{") ||
        values.text.includes("}");
      errors.text = textHasInvalidChars ? "Invalid text" : undefined;
    }
    return errors;
  },

  handleSubmit: (values: TextAreaFormValues, { setSubmitting, props }) => {
    props.onSave(values);
    setSubmitting(false);
  },
})(TextAreaForm);
