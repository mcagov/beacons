import { GetServerSidePropsResult } from "next";
import { BeaconsPageRouter } from "./BeaconsPageRouter";

export async function withAdditionalProps(
  router: BeaconsPageRouter,
  additionalProps: Record<string, any>
): Promise<GetServerSidePropsResult<any>> {
  const result = await router.execute();
  if ("props" in result) {
    return { ...result, props: { ...result.props, ...additionalProps } };
  } else {
    return result;
  }
}
