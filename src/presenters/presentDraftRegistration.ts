import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../entities/DraftRegistration";
import { withoutErrorMessages } from "../lib/form/lib";
import { FormManagerFactory } from "../lib/handlePageRequest";
import { RegistrationFormMapper } from "./RegistrationFormMapper";

export const presentDraftRegistration = <T>(
  draftRegistration: DraftRegistration,
  validationRules: FormManagerFactory,
  mapper: RegistrationFormMapper<T>
): GetServerSidePropsResult<any> => ({
  props: {
    draftRegistration,
    form: withoutErrorMessages<T>(
      mapper.toForm(draftRegistration),
      validationRules
    ),
  },
});
