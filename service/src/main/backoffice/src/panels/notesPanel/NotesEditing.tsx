import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { NoteType } from "entities/INote";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import React from "react";

interface FormValues {
  type: string;
  text: string;
}

interface NotesFormProps extends FormikProps<FormValues> {
  onCancel: () => void;
}

const NotesForm = (props: NotesFormProps) => {
  const { errors, isSubmitting, onCancel } = props;

  return (
    <>
      <h2>Add a note</h2>
      <Form>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            What type of note is this? (Required)
          </FormLabel>
          <RadioGroup aria-label="note type" name="radio-buttons-group">
            <label>
              <Field
                as={Radio}
                type="radio"
                id="type"
                name="type"
                value={NoteType.GENERAL}
                data-testid="general-note-type"
              />
              General note (e.g. owner has contacted the service for advice)
            </label>
            <label>
              <Field
                as={Radio}
                type="radio"
                id="type"
                name="type"
                value={NoteType.INCIDENT}
                data-testid="incident-note-type"
              />
              Incident note (e.g. beacon activation, alarm raised etc.)
            </label>
          </RadioGroup>
        </FormControl>
        <Box mr={75}>
          <Field
            as={TextField}
            id="text"
            name="text"
            type="string"
            label="Please add your notes below (Required)"
            multiline
            fullWidth
            helperText="The date and your name will be automatically added"
            rows={4}
            placeholder="Add a note here"
            data-testid="note-input-field"
          />
        </Box>
        <Box mt={2} mr={2}>
          <Button
            name="save"
            type="submit"
            color="secondary"
            data-testid="save"
            variant="contained"
            disabled={isSubmitting || !!errors.type || !!errors.text}
          >
            Save note
          </Button>
          <Button name="cancel" onClick={onCancel} data-testid="cancel">
            Cancel
          </Button>
        </Box>
      </Form>
    </>
  );
};

export const NotesEditing = withFormik<
  {
    onSave: (note: FormValues) => void;
    onCancel: () => void;
  },
  FormValues
>({
  mapPropsToErrors: () => {
    return {
      type: "Required",
      text: "Required",
    };
  },

  validate: (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};
    if (!values.type) {
      errors.type = "Required";
    } else if (!values.text) {
      errors.text = "Required";
    }
    return errors;
  },

  handleSubmit: (values: FormValues, { setSubmitting, props }) => {
    props.onSave(values);
    setSubmitting(false);
  },
})(NotesForm);
