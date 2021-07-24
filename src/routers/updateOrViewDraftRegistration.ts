import { GetServerSidePropsResult } from "next";
import { isValid } from "../lib/form/lib";
import { FormManagerFactory } from "../lib/handlePageRequest";
import { parseForm } from "../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../lib/redirectUserTo";
import { draftRegistrationId as id } from "../lib/types";
import { PageURLs } from "../lib/urls";
import { presentDraftRegistration } from "../presenters/presentDraftRegistration";
import { presentRegistrationFormErrors } from "../presenters/presentRegistrationFormErrors";
import { RegistrationFormMapper } from "../presenters/RegistrationFormMapper";

export const updateOrViewDraftRegistration = async <T>(
  context: BeaconsGetServerSidePropsContext,
  validationRules: FormManagerFactory,
  mapper: RegistrationFormMapper<T>,
  nextPage: PageURLs
): Promise<GetServerSidePropsResult<any>> => {
  const rules: RegistrationFormRule<T>[] = [
    new UserSubmittedInvalidForm(),
    new UserSubmittedValidForm(),
    new UserRequestedToViewForm(),
  ];

  return await rules
    .find(async (rule) => await rule.condition(context, validationRules))
    .action(context, validationRules, mapper, nextPage);
};

interface RegistrationFormRule<T> {
  condition: (
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) => Promise<boolean>;
  action: (
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    nextPage: PageURLs
  ) => Promise<GetServerSidePropsResult<any>>;
}

class UserSubmittedValidForm<T> implements RegistrationFormRule<T> {
  public async condition(context, validationRules) {
    return (
      context.req.method === "POST" &&
      isValid(await parseForm<T>(context.req), validationRules)
    );
  }

  public async action(context, validationRules, mapper, nextPage) {
    await context.container.saveDraftRegistration(
      id(context),
      mapper.toDraftRegistration(await parseForm<T>(context.req))
    );

    return redirectUserTo(nextPage);
  }
}

class UserSubmittedInvalidForm<T> implements RegistrationFormRule<T> {
  public async condition(context, validationRules) {
    return (
      context.req.method === "POST" &&
      !isValid(await parseForm<T>(context.req), validationRules)
    );
  }

  public async action(context, validationRules, mapper) {
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
  public async condition(context) {
    return context.req.method === "GET";
  }

  public async action(context, validationRules, mapper) {
    return presentDraftRegistration<T>(
      await parseForm<T>(context.req),
      validationRules,
      mapper,
      {
        showCookieBanner: context.showCookieBanner,
      }
    );
  }
}
