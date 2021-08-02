import { DraftRegistration } from "../entities/DraftRegistration";

export interface DraftRegistrationFormMapper<T> {
  formToDraftRegistration: (form: T) => DraftRegistration;
  draftRegistrationToForm: (draftRegistration: DraftRegistration) => T;
}
