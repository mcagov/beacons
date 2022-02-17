import { GetServerSidePropsResult } from "next";
import { PageRouter } from "./PageRouter";
import { Rule } from "./rules/Rule";

export class BeaconsPageRouter implements PageRouter {
  private readonly rules: Rule[];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  public async execute(): Promise<GetServerSidePropsResult<any>> {
    for (const rule of this.rules) {
      if (await rule.condition()) {
        return await rule.action();
      }
    }
  }
}
