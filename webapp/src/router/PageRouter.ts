import { GetServerSidePropsResult } from "next";

export interface PageRouter {
  execute: () => Promise<GetServerSidePropsResult<any>>;
}
