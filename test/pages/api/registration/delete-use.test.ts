import { NextApiRequest, NextApiResponse } from "next";
import { BeaconsApiRequest } from "../../../../src/lib/container";
import { formSubmissionCookieId } from "../../../../src/lib/types";
import handler from "../../../../src/pages/api/registration/delete-use";

describe("/api/registration/delete-use", () => {
  it("calls the injected deleteCachedUse use case to delete a use by index", async () => {
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: "test-submission-id",
      },
      query: {
        useIndex: "0",
        onSuccess: "/irrelevant-on-success-path",
        onFailure: "/irrelevant-on-failure-path",
      },
      container: {
        deleteCachedUse: jest.fn(),
      },
    };
    const res: Partial<NextApiResponse> = { redirect: jest.fn() };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(req.container.deleteCachedUse).toHaveBeenCalledWith(
      req.cookies[formSubmissionCookieId],
      0
    );
  });

  it("does the same for other values of useIndex", async () => {
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: "test-submission-id",
      },
      query: {
        useIndex: "12",
        onSuccess: "/irrelevant-on-success-path",
        onFailure: "/irrelevant-on-failure-path",
      },
      container: {
        deleteCachedUse: jest.fn(),
      },
    };
    const res: Partial<NextApiResponse> = { redirect: jest.fn() };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(req.container.deleteCachedUse).toHaveBeenCalledWith(
      req.cookies[formSubmissionCookieId],
      12
    );
  });

  it("redirects the user to the onSuccess URI when deleting is successful", async () => {
    const submissionId = "test-submission-id";
    const deleteCachedUse = jest.fn();
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: submissionId,
      },
      query: {
        useIndex: "0",
        onSuccess: "/on-success-path",
        onFailure: "/irrelevant-on-failure-path",
      },
      container: {
        deleteCachedUse: deleteCachedUse,
      },
    };
    const res: Partial<NextApiResponse> = { redirect: jest.fn() };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(req.query.onSuccess);
  });

  it("redirects the user to the onFailure URI when deleting is not successful", async () => {
    const submissionId = "test-submission-id";
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: submissionId,
      },
      query: {
        useIndex: "0",
        onSuccess: "/on-success-path",
        onFailure: "/irrelevant-on-failure-path",
      },
      container: {
        deleteCachedUse: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      },
    };
    const res: Partial<NextApiResponse> = { redirect: jest.fn() };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(req.query.onFailure);
  });
});
