import * as yup from "yup";

export const consentValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .required("Mobile is required"),
  pan: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN number")
    .required("PAN is required"),
  loanPurpose: yup.string().required("Loan purpose is required"),
});
