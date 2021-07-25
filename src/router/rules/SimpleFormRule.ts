import { GetServerSidePropsResult } from "next";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { PageURLs } from "../../lib/urls";
import { Rule } from "./Rule";

export abstract class SimpleFormRule implements Rule {
  protected readonly context: BeaconsGetServerSidePropsContext;
  protected readonly validationRules: FormManagerFactory;
  protected readonly additionalProps?: Record<string, any>;
  protected readonly nextPage?: PageURLs | Promise<PageURLs>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    nextPage?: PageURLs | Promise<PageURLs>,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.additionalProps = additionalProps;
    this.nextPage = nextPage;
  }

  abstract condition(): Promise<boolean>;

  abstract action(): Promise<GetServerSidePropsResult<any>>;
}
