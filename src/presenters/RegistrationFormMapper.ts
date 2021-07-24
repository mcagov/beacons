import { DraftRegistration } from "../entities/DraftRegistration";

export interface RegistrationFormMapper<T> {
  toDraftRegistration: (form: T) => DraftRegistration;
  toForm: (draftRegistration: DraftRegistration) => T;
}
