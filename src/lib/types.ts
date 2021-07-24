import { GetServerSidePropsContext } from "next";

export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
}

export enum BeaconIntent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  CHANGE_OWNERSHIP = "CHANGE_OWNERSHIP",
  WITHDRAW = "WITHDRAW",
  OTHER = "OTHER",
}

export const formSubmissionCookieId = "submissionId";

export const draftRegistrationId = (
  context: GetServerSidePropsContext
): string => context.req.cookies["submissionId"];

export const acceptRejectCookieId = "acceptRejectId";
