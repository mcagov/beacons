import "./text-area-form.scss";
import { Box, Button, FormControl, TextField } from "@mui/material";
import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
  withFormik,
} from "formik";
import * as Yup from "yup";
import { FunctionComponent, Props } from "react";
import { validate } from "uuid";

interface ITextAreaFormSectionProps {
  formSectionTitle?: string;
  submitButtonText: string;
  numberOfRowsForTextArea: number;
  initialValue?: string;
  textType: string;
  textSubmitted: (text: string) => void;
  cancelled: (cancelled: boolean) => void;
}

interface TextAreaFormValues {
  text: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export const TextAreaFormSection: FunctionComponent<
  ITextAreaFormSectionProps
> = ({
  formSectionTitle,
  submitButtonText,
  numberOfRowsForTextArea,
  initialValue,
  textType,
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
        initialValue={initialValue}
        textType={textType}
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
  initialValue?: string;
  textType: string;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const {
    errors,
    isSubmitting,
    submitButtonText,
    numberOfRowsForTextArea,
    initialValue,
    textType,
    onCancel,
    onSave,
  } = props;
  const submit = () => {
    onSave(props.values);
  };

  function validateText(text: string): FormikErrors<TextAreaFormValues> {
    let errors: FormikErrors<TextAreaFormValues> = {};
    if (!text) {
      errors.text = "Required";
    }
    if (text) {
      const textHasInvalidChars =
        text.includes("<") ||
        text.includes(">") ||
        text.includes("{") ||
        text.includes("}") ||
        text.includes("/") ||
        text.includes("\\") ||
        text.includes("&") ||
        text.includes("$");
      errors.text = textHasInvalidChars ? "Invalid text" : undefined;
    }

    if (text && textType === "email") {
      const validationResult = validationSchema.validate(text);
      validationResult.then((valid) => {
        errors.text = "Invalid email";
      });
    }
    console.log(errors);

    return errors;
  }

  return (
    <>
      {/* <Formik
        validationSchema={validationSchema}
        initialValues={values}
        onSubmit={props.onSave}> */}
      <Form className="textarea-form">
        <FormControl component="fieldset" fullWidth>
          <Box>
            <Field
              as={TextField}
              id="text"
              name="text"
              type={textType}
              multiline
              fullWidth
              rows={numberOfRowsForTextArea}
              data-testid="textarea-form-field"
              placeholder="Add your text here"
              defaultValue={initialValue}
              validate={validateText}
              error={props.touched && Boolean(errors.text)}
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
      {/* </Formik> */}
    </>
  );
};

export const TextAreaSection = withFormik<
  {
    onSave: (values: TextAreaFormValues) => void;
    onCancel: () => void;
    submitButtonText: string;
    numberOfRowsForTextArea: number;
    initialValue?: string;
    textType: string;
  },
  TextAreaFormValues
>({
  mapPropsToErrors: () => {
    return {
      text: "Required",
    };
  },

  // validate: (values: TextAreaFormValues) => {
  //   let errors: FormikErrors<TextAreaFormValues> = {};
  //   if (!values.text) {
  //     errors.text = "Required";
  //   }
  //   if (values.text) {
  //     const textHasInvalidChars =
  //       values.text.includes("<") ||
  //       values.text.includes(">") ||
  //       values.text.includes("{") ||
  //       values.text.includes("}") ||
  //       values.text.includes("/") ||
  //       values.text.includes("\\") ||
  //       values.text.includes("&") ||
  //       values.text.includes("$");
  //     errors.text = textHasInvalidChars ? "Invalid text" : undefined;
  //   }

  //   // enum
  //   if( === )
  //   return errors;
  // },
  //},

  handleSubmit: (values: TextAreaFormValues, { setSubmitting, props }) => {
    props.onSave(values);
    setSubmitting(false);
  },
})(TextAreaForm);
