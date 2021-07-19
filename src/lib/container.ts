import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { appContainer, IAppContainer } from "./appContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
};

export const withContainer =
  (callback: GetServerSideProps): GetServerSideProps =>
  (context: BeaconsGetServerSidePropsContext) => {
    context.container = context.container || appContainer;
    return callback(context);
  };

export type BeaconsApiRequest = NextApiRequest & {
  container: Partial<IAppContainer>;
};

export const withApiContainer =
  (callback: NextApiHandler): NextApiHandler =>
  (req: BeaconsApiRequest, res: NextApiResponse) => {
    req.container = req.container || appContainer;
    return callback(req, res);
  };
