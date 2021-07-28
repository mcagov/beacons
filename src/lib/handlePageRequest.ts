import { FormJSON, FormManager } from "./form/FormManager";
import { FormSubmission } from "./formCache";

export type FormManagerFactory = (formData: FormSubmission) => FormManager;

export interface DraftRegistrationPageProps {
  form: FormJSON;
  showCookieBanner: boolean;
}

export interface DraftBeaconUsePageProps extends DraftRegistrationPageProps {
  useIndex: number;
}
