import { NextApiRequest, NextApiResponse } from "next";
import { BeaconsApiRequest } from "../../../../src/lib/middleware/withApiContainer";
import { formSubmissionCookieId } from "../../../../src/lib/types";
import { CreateRegistrationPageURLs } from "../../../../src/lib/urls";
import handler from "../../../../src/pages/api/registration/clear-and-check-beacon-details";

describe("/api/registration/clear-and-check-beacon-details", () => {
  const existingSubmissionId = "existing-registration-id";

  const setup = () => {
    const req: Partial<BeaconsApiRequest> = {
      cookies: {
        [formSubmissionCookieId]: existingSubmissionId,
      },
      container: {
        deleteDraftRegistration: jest.fn(),
      },
    };
    const res: Partial<NextApiResponse> = {
      redirect: jest.fn(),
      setHeader: jest.fn(),
    };

    return { req, res };
  };

  const newSubmissionIdFrom = (res: Partial<NextApiResponse>): string => {
    const [name, value] = (res.setHeader as jest.Mock).mock.calls[0];
    expect(name).toBe("Set-Cookie");
    const match = (value as string).match(
      new RegExp(`^${formSubmissionCookieId}=([^;]+)`),
    );
    return match?.[1];
  };

  it("deletes the draft registration for the existing submission id", async () => {
    const { req, res } = setup();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(req.container.deleteDraftRegistration).toHaveBeenCalledWith(
      existingSubmissionId,
    );
  });

  it("sets a new submission id cookie so the new registration is not stored against an existing registration", async () => {
    const { req, res } = setup();

    await handler(req as NextApiRequest, res as NextApiResponse);

    const newSubmissionId = newSubmissionIdFrom(res);
    expect(newSubmissionId).toBeDefined();
    expect(newSubmissionId).not.toBe(existingSubmissionId);
  });

  it("sets the submission id cookie for the whole site", async () => {
    const { req, res } = setup();

    await handler(req as NextApiRequest, res as NextApiResponse);

    const [, value] = (res.setHeader as jest.Mock).mock.calls[0];
    expect(value).toContain("Path=/");
    expect(value).toContain("HttpOnly");
    expect(value).toContain("SameSite=Lax");
  });

  it("sets a different submission id each time", async () => {
    const first = setup();
    const second = setup();

    await handler(first.req as NextApiRequest, first.res as NextApiResponse);
    await handler(second.req as NextApiRequest, second.res as NextApiResponse);

    expect(newSubmissionIdFrom(first.res)).not.toBe(
      newSubmissionIdFrom(second.res),
    );
  });

  it("redirects the user to the check beacon details page", async () => {
    const { req, res } = setup();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(
      CreateRegistrationPageURLs.checkBeaconDetails,
    );
  });
});
