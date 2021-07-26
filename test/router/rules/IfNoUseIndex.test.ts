import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { Environment } from "../../../src/lib/registration/types";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { IfNoUseIndex } from "../../../src/router/rules/IfNoUseIndex";

describe("IfNoUseIndex", () => {
  describe("condition", () => {
    it("triggers if there is no useIndex query param", async () => {
      const context = {
        req: {
          method: "GET",
        },
        query: {
          whereIsTheUseIndexQueryParam: "itIsMissingOhNo",
        },
      };
      const rule = new IfNoUseIndex(context as any);

      const result = await rule.condition();

      expect(result).toBe(true);
    });

    it("doesn't trigger if there is a useIndex query param", async () => {
      const context = {
        req: {
          method: "GET",
        },
        query: {
          useIndex: "1",
        },
      };
      const rule = new IfNoUseIndex(context as any);

      const result = await rule.condition();

      expect(result).toBe(false);
    });
  });

  describe("action", () => {
    it("when there are existing uses it sends the user to the most recently added use", async () => {
      const draftRegistrationWithUses: DraftRegistration = {
        uses: [
          { environment: Environment.MARITIME },
          { environment: Environment.AVIATION },
        ],
      };
      const context = {
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(draftRegistrationWithUses),
        },
        req: {
          url: "current-page-url",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
      };
      const rule = new IfNoUseIndex(context as any);

      const result = await rule.action();

      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url?useIndex=1",
        },
      });
    });

    it("when there are no uses it creates a new use and sends the user to it", async () => {
      const draftRegistrationNoUses: DraftRegistration = {};
      const context = {
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(draftRegistrationNoUses),
          addNewUseToDraftRegistration: jest.fn(),
        },
        req: {
          url: "current-page-url",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
      };
      const rule = new IfNoUseIndex(context as any);

      const result = await rule.action();

      expect(
        context.container.addNewUseToDraftRegistration
      ).toHaveBeenCalledWith("test-draft-registration-id");
      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url?useIndex=0",
        },
      });
    });
  });

  // describe("action", () => {
  //   it("when there is no cookie set it redirects the user to the start page", async () => {
  //     const context = {
  //       req: {
  //         method: "GET",
  //         cookies: {
  //           irrelevant: "theFormSubmissionCookieIdIsMissing!",
  //         },
  //       },
  //     };
  //     const rule = new IfNoDraftRegistration(context as any);
  //
  //     const result: GetServerSidePropsResult<any> = await rule.action();
  //
  //     expect(result).toMatchObject({
  //       redirect: {
  //         destination: PageURLs.start,
  //       },
  //     });
  //   });
  //
  //   it("when there is a cookie set it creates a blank DraftRegistration and reloads the current page", async () => {
  //     const context = {
  //       req: {
  //         url: "current-page-url",
  //         method: "GET",
  //         cookies: {
  //           [formSubmissionCookieId]: "test-draft-registration-id",
  //         },
  //       } as Partial<IncomingMessage>,
  //       container: {
  //         saveDraftRegistration: jest.fn(),
  //       } as Partial<IAppContainer>,
  //     };
  //     const rule = new IfNoDraftRegistration(context as any);
  //     const blankRegistration: DraftRegistration = {};
  //
  //     const result: GetServerSidePropsResult<any> = await rule.action();
  //
  //     expect(context.container.saveDraftRegistration).toHaveBeenCalledWith(
  //       "test-draft-registration-id",
  //       blankRegistration
  //     );
  //     expect(result).toMatchObject({
  //       redirect: {
  //         destination: "current-page-url",
  //       },
  //     });
  //   });
  // });
});
