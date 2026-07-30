import { consentIniValue } from "./consent/values";
import { loginValidation } from "./login/validation";
import { loginIniValues } from "./login/values";

export const forms = {
  login: {
    values: loginIniValues,
    validation: loginValidation,
  },
  consent: {
    values: consentIniValue,
  },
};
