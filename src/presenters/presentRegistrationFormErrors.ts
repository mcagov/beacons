import { GetServerSidePropsResult } from "next";
import { withErrorMessages } from "../lib/form/lib";
import { FormManagerFactory } from "../lib/handlePageRequest";
import { RegistrationFormMapper } from "./RegistrationFormMapper";

export const presentRegistrationFormErrors = <T>(
  form: T,
  validationRules: FormManagerFactory,
  mapper: RegistrationFormMapper<T>,
  props = {}
): GetServerSidePropsResult<any> => ({
  props: {
    ...props,
    form: withErrorMessages<T>(
      mapper.toForm(mapper.toDraftRegistration(form)),
      validationRules
    ),
  },
});
