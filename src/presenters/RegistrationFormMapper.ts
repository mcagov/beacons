import { DraftRegistration } from "../entities/DraftRegistration";

export interface RegistrationFormMapper<T> {
  formToDraftRegistration: (form: T) => DraftRegistration;
  draftRegistrationToForm: (draftRegistration: DraftRegistration) => T;
}
