import { FormJSON, FormManager } from "./form/formManager";
import { FormSubmission } from "./formCache";
import { IRegistration } from "./registration/types";

export type FormManagerFactory = (formData: FormSubmission) => FormManager;

export interface FormPageProps {
  form: FormJSON;
  showCookieBanner?: boolean;
  registration?: IRegistration;
  flattenedRegistration?: FormSubmission;
  useIndex?: number;
}
