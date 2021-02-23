import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { BeaconCacheEntry } from "./formCache";
import { FormValidator } from "./formValidator";
import { updateFormCache, withCookieRedirect } from "./middleware";

export const handlePageRequest = (
  destinationIfValid: string
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const formData: BeaconCacheEntry = await updateFormCache(context);

    const userDidSubmitForm = context.req.method === "POST";
    const formIsValid = !FormValidator.hasErrors(formData);

    if (userDidSubmitForm && formIsValid) {
      return {
        redirect: {
          statusCode: 303,
          destination: destinationIfValid,
        },
      };
    }

    return {
      props: {
        formData,
        needsValidation: userDidSubmitForm,
      },
    };
  });
