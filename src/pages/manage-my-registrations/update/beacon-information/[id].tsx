import { GetServerSideProps } from "next";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { UpdatePageURLs } from "../../../../lib/urls";
import BeaconInformationPage, {
  handleBeaconInformationPageRequest,
} from "../../../register-a-beacon/beacon-information";

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return handleBeaconInformationPageRequest(
      context,
      UpdatePageURLs.environment
    );
  })
);

export default BeaconInformationPage;
