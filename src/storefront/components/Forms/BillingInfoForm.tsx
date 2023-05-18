import { IBillingInfo } from "@/types/cart";
import { IValidatedInputField } from "@/types/common";
import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import BasicField from "./BasicField";

export interface IBillingInfoFormProps {
  first_name: IValidatedInputField;
  surname: IValidatedInputField;
  company_name: IValidatedInputField;
  company_id: IValidatedInputField;
  vat_number: IValidatedInputField;
  street: IValidatedInputField;
  city: IValidatedInputField;
  postal_code: IValidatedInputField;
  country: IValidatedInputField;
}

export const billingInfoInitialData = (
  billingInfo: IBillingInfo,
  setter: Dispatch<SetStateAction<IBillingInfoFormProps>>
): IBillingInfoFormProps => {
  /**
   * Purpose of this function is to take the billing info from the API and
   * convert it into the format that the BillingInfoForm component expects.
   * */

  return {
    first_name: {
      value: billingInfo.first_name,
      isValid: billingInfo.first_name != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          first_name: { ...prevState.first_name, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          first_name: { ...prevState.first_name, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "First name is required",
      label: "First name",
    },
    surname: {
      value: billingInfo.surname,
      isValid: billingInfo.surname != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          surname: { ...prevState.surname, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          surname: { ...prevState.surname, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "Surname is required",
      label: "Surname",
    },
    company_name: {
      value: billingInfo.company_name,
      isValid: true,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          email: { ...prevState.company_name, value },
        })),
      isRequired: false,
      label: "Company name",
    },
    company_id: {
      value: billingInfo.company_id,
      isValid: true,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          company_id: { ...prevState.company_id, value },
        })),
      isRequired: false,
      label: "Company ID",
    },
    vat_number: {
      value: billingInfo.vat_number,
      isValid: true,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          email: { ...prevState.vat_number, value },
        })),
      isRequired: false,
      label: "VAT ID",
    },
    street: {
      value: billingInfo.street,
      isValid: billingInfo.street != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          street: { ...prevState.street, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          street: { ...prevState.street, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "Street is required",
      label: "Street",
    },
    city: {
      value: billingInfo.city,
      isValid: billingInfo.city != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          city: { ...prevState.city, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          city: { ...prevState.city, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "City is required",
      label: "City",
    },
    postal_code: {
      value: billingInfo.postal_code,
      isValid: billingInfo.postal_code != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          postal_code: { ...prevState.postal_code, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          postal_code: { ...prevState.postal_code, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "Postal code is required",
      label: "Postal code",
    },
    country: {
      value: `${billingInfo.country}`,
      isValid: `${billingInfo.country}` != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          country: { ...prevState.country, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          country: { ...prevState.country, value },
        })),
      validator: (value: string) => value.length > 0,
      isRequired: true,
      errorMessage: "Country is required",
      label: "Country",
    },
  };
};

interface IBillingInfoFormComponentProps extends IBillingInfoFormProps {
  setIsFormValid: (value: boolean) => void;
}

const BillingInfoForm = (props: IBillingInfoFormComponentProps) => {
  const { setIsFormValid, ...billingInfo } = props;

  /**
   * Purpose of this component is to display the billing information form
   * and have it be pre-populated with the billing information if it exists.
   *
   * It should be a form with header "Billing information" and the following fields:
   * - First name
   * - Surname
   * - Email
   * - Phone
   * - Additional info (optional)
   * - Street
   * - City
   * - Postal code
   * - Country
   *
   * And all done in MUI with validation.
   * */

  const validateBillingInfo = useCallback(() => {
    // iterate through the billing info and check if all the fields are valid if they're required
    const billingInfoValues: IValidatedInputField[] =
      Object.values(billingInfo);
    for (let i = 0; i < billingInfoValues.length; i++) {
      const value = billingInfoValues[i];
      if (
        value.isRequired &&
        (value.isValid == false || value.isValid == undefined)
      ) {
        setIsFormValid(false);
        return;
      }
    }
    if (billingInfoValues.length === 0) {
      setIsFormValid(false);
      return;
    }
    setIsFormValid(true);
  }, [billingInfo]);

  useEffect(() => {
    validateBillingInfo();
  }, [billingInfo]);

  const {
    first_name,
    surname,
    company_name,
    company_id,
    vat_number,
    street,
    city,
    postal_code,
    country,
  } = billingInfo;

  return (
    <div className="billing-info-form">
      <h2>Billing information</h2>
      <form>
        <BasicField field={first_name} />
        <BasicField field={surname} />
        <BasicField field={company_name} />
        <BasicField field={company_id} />
        <BasicField field={vat_number} />
        <BasicField field={street} />
        <BasicField field={city} />
        <BasicField field={postal_code} />
        <BasicField field={country} />
      </form>
    </div>
  );
};

export default BillingInfoForm;
