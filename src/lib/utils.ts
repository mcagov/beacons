import { GetServerSidePropsContext } from "next";
import { BeaconCacheEntry } from "./formCache";
import { FormValidator } from "./formValidator";
import { updateFormCache, withCookieRedirect } from "./middleware";

/**
 * Convenience function for converting a single or array of a given type into an array with nullish values removed.
 *
 * @param toConvert {T|T[]}  The value to safe return as an array
 * @returns         {T[]}    An array of the provided values
 */
export function toArray<T>(toConvert: T | T[]): T[] {
  const toReturn = toConvert instanceof Array ? toConvert : [toConvert];
  return toReturn.filter((value: T) => !!value);
}

export const ensureFormDataHasKeys = (
  formData: Record<string, string>,
  ...keys: string[]
): Record<string, string> => {
  const newFormData = { ...formData };
  keys.forEach((key: string) => {
    if (!newFormData[key]) {
      newFormData[key] = "";
    }
  });

  return newFormData;
};

export const handleFormSubmission = (destinationIfValid: string) =>
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
