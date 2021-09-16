import { DraftRegistration } from "../entities/DraftRegistration";
import { FormSubmission } from "../presenters/formSubmission";
import { FormJSON, FormManager } from "./form/FormManager";

export type FormManagerFactory = (formData: FormSubmission) => FormManager;

export interface DraftRegistrationPageProps {
  form: FormJSON;
  draftRegistration?: DraftRegistration;
  showCookieBanner: boolean;
}

export interface DraftBeaconUsePageProps extends DraftRegistrationPageProps {
  useId: string;
}
