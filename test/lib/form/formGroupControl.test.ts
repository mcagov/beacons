import { FormGroupControl } from "../../../src/lib/form/formGroupControl";

describe("FormGroupControl", () => {
  let value;
  let formControl: FormGroupControl;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      hasErrorFn: () => shouldError,
    };
  };

  it("TODO", () => {
    // TODO
  });
});
