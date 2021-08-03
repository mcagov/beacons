import { FormSubmission } from "../formCache";
import { FormManagerFactory } from "../handlePageRequest";
import { FormJSON } from "./FormManager";

export function isValid(
  form: FormSubmission,
  rules: FormManagerFactory
): boolean {
  const formManager = rules(form);

  formManager.markAsDirty();

  return formManager.isValid();
}

export function withErrorMessages(
  form: FormSubmission,
  rules: FormManagerFactory
): FormJSON {
  const formManager = rules(form);

  formManager.markAsDirty();

  return formManager.serialise();
}

export function withoutErrorMessages(
  form: FormSubmission,
  rules: FormManagerFactory
): FormJSON {
  return rules(form).serialise();
}
