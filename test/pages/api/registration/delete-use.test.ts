import { NextApiRequest, NextApiResponse } from "next";
import { BeaconsApiRequest } from "../../../../src/lib/container";
import { formSubmissionCookieId } from "../../../../src/lib/types";
import handler from "../../../../src/pages/api/registration/delete-use";

describe("/api/registration/delete-use", () => {
  it("calls the injected deleteCachedUse use case", () => {
    const useIndex = 0;
    const submissionId = "test-submission-id";
    const deleteCachedUse = jest.fn();
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: submissionId,
      },
      query: {
        onSuccess: "/irrelevant-on-success-path",
        onFailure: "/irrelevant-on-failure-path",
      },
      container: {
        deleteCachedUse: deleteCachedUse,
      },
    };
    const res: Partial<NextApiResponse> = {};

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(deleteCachedUse).toHaveBeenCalledWith(submissionId, useIndex);
  });
});
