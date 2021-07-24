import { GetServerSidePropsResult } from "next";
import { isValid } from "../lib/form/lib";
import { userDidSubmitForm } from "../lib/form/userDidSubmitForm";
import { FormManagerFactory } from "../lib/handlePageRequest";
import { parseForm } from "../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../lib/redirectUserTo";
import { draftRegistrationId as id } from "../lib/types";
import { presentRegistrationFormErrors } from "../presenters/presentRegistrationFormErrors";
import { RegistrationFormMapper } from "../presenters/RegistrationFormMapper";

export const updateOrViewDraftRegistration = async <T>(
  context: BeaconsGetServerSidePropsContext,
  validationRules: FormManagerFactory,
  mapper: RegistrationFormMapper<T>
): Promise<GetServerSidePropsResult<any>> => {
  const rules: RegistrationFormRule<T>[] = [
    new UserSubmittedInvalidForm(),
    new UserSubmittedValidForm(),
    new UserRequestedToViewForm(),
  ];

  return await rules
    .find(async (rule) => await rule.condition(context, validationRules))
    .action(context, validationRules, mapper);
};

interface RegistrationFormRule<T> {
  condition: (
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) => Promise<boolean>;
  action: (
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>
  ) => Promise<GetServerSidePropsResult<any>>;
}

class UserSubmittedValidForm<T> implements RegistrationFormRule<T> {
  public async condition(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    return (
      userDidSubmitForm(context) &&
      isValid(await parseForm<T>(context.req), validationRules)
    );
  }

  public async action(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>
  ) {
    await context.container.saveDraftRegistration(
      id(context),
      mapper.toDraftRegistration(await parseForm<T>(context.req))
    );

    return redirectUserTo("/register-a-beacon/beacon-use");
  }
}

class UserSubmittedInvalidForm<T> implements RegistrationFormRule<T> {
  public async condition(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    return (
      userDidSubmitForm(context) &&
      isValid(await parseForm<T>(context.req), validationRules)
    );
  }

  public async action(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>
  ) {
    return presentRegistrationFormErrors(
      await parseForm<T>(context.req),
      validationRules,
      mapper,
      {
        showCookieBanner: context.showCookieBanner,
      }
    );
  }
}

class UserRequestedToViewForm<T> implements RegistrationFormRule<T> {
  public async condition(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    return (
      userDidSubmitForm(context) &&
      isValid(await parseForm<T>(context.req), validationRules)
    );
  }

  public async action(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>
  ) {
    return presentRegistrationFormErrors<T>(
      await parseForm<T>(context.req),
      validationRules,
      mapper,
      {
        showCookieBanner: context.showCookieBanner,
      }
    );
  }
}
