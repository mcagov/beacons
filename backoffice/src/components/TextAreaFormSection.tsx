import "./text-area-form.scss";
import { Box, Button, FormControl, TextField } from "@mui/material";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import { FunctionComponent } from "react";

interface ITextAreaFormSectionProps {
  formSectionTitle?: string;
  submitButtonText: string;
  numberOfRowsForTextArea: number;
  textSubmitted: (text: string) => void;
  cancelled: (cancelled: boolean) => void;
}

interface TextAreaFormValues {
  text: string;
}

export const TextAreaFormSection: FunctionComponent<
  ITextAreaFormSectionProps
> = ({
  formSectionTitle,
  submitButtonText,
  numberOfRowsForTextArea,
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
        submitButtonText={submitButtonText}
        numberOfRowsForTextArea={numberOfRowsForTextArea}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

interface TextAreaFormProps extends FormikProps<TextAreaFormValues> {
  onSave: (values: TextAreaFormValues) => void;
  onCancel: () => void;
  submitButtonText: string;
  numberOfRowsForTextArea: number;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const {
    errors,
    isSubmitting,
    submitButtonText,
    numberOfRowsForTextArea,
    onCancel,
    onSave,
  } = props;
  const submit = () => {
    onSave(props.values);
  };

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
              rows={numberOfRowsForTextArea}
              data-testid="textarea-form-field"
              placeholder="Add your text here"
              error={props.touched && errors.text}
              helperText={props.touched && errors.text}
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
            onClick={submit}
          >
            {submitButtonText}
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
    onSave: (values: TextAreaFormValues) => void;
    onCancel: () => void;
    submitButtonText: string;
    numberOfRowsForTextArea: number;
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
      const textHasInvalidChars =
        values.text.includes("<") ||
        values.text.includes(">") ||
        values.text.includes("{") ||
        values.text.includes("}") ||
        values.text.includes("/") ||
        values.text.includes("\\") ||
        values.text.includes("&") ||
        values.text.includes("$");
      errors.text = textHasInvalidChars ? "Invalid text" : undefined;
    }
    return errors;
  },

  handleSubmit: (values: TextAreaFormValues, { setSubmitting, props }) => {
    props.onSave(values);
    console.log(values.text);
    setSubmitting(false);
  },
})(TextAreaForm);
