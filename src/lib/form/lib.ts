import { FormManagerFactory } from "../handlePageRequest";
import { FormJSON } from "./formManager";

export function isValid<T>(form: T, rules: FormManagerFactory): boolean {
  const formManager = rules(form);

  formManager.markAsDirty();

  return formManager.isValid();
}

export function withErrorMessages<T>(
  form: T,
  rules: FormManagerFactory
): FormJSON {
  const formManager = rules(form);

  formManager.markAsDirty();

  return formManager.serialise();
}

export function withoutErrorMessages<T>(
  form: T,
  rules: FormManagerFactory
): FormJSON {
  return rules(form).serialise();
}
