import { GetServerSidePropsResult } from "next";

export interface Rule {
  condition: () => Promise<boolean>;
  action: () => Promise<GetServerSidePropsResult<any>>;
}
