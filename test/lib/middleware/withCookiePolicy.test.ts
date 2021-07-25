import { withCookiePolicy } from "../../../src/lib/middleware";
import {
  acceptRejectCookieId,
  formSubmissionCookieId,
} from "../../../src/lib/types";

// it("should return a new instance of the application container if none is provided", () => {
//   const providedContext: any = {};
//   const callback = jest.fn();
//   const withContainerFunction = withContainer(callback);
//   withContainerFunction(providedContext);
//
//   expect(providedContext.container).toBeDefined();
// });

describe("withCookiePolicy", () => {
  it("should decorate the context with false if the user has accepted the cookie policy", async () => {
    const context = {
      req: {
        cookies: {
          [formSubmissionCookieId]: true,
          [acceptRejectCookieId]: true,
        },
      },
    } as any;
    const getServerSideProps = withCookiePolicy(jest.fn());

    await getServerSideProps(context as any);

    expect(context.showCookieBanner).toBe(false);
  });

  it("should decorate the context with true if the user has not accepted the cookie policy", async () => {
    const context = {
      req: {
        cookies: {
          [formSubmissionCookieId]: true,
          [acceptRejectCookieId]: false,
        },
      },
    } as any;
    const getServerSideProps = withCookiePolicy(jest.fn());

    await getServerSideProps(context as any);

    expect(context.showCookieBanner).toBe(true);
  });
});
