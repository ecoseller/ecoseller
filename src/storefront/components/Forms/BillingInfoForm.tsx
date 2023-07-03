import { IBillingInfo, ICountryOption } from "@/types/cart";
import { IValidatedInputField } from "@/types/common";
// utils
import { useTranslation } from "next-i18next";
import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import BasicField, { BasicSelect, TwoFieldsOneRowWrapper } from "./BasicField";

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

export const exportBillingInfo = (
  billingInfo: IBillingInfoFormProps
): IBillingInfo => {
  /**
   * Purpose of this function is to take the billing info from the BillingInfoForm component
   * and convert it into the format that the API expects.
   * */

  return {
    first_name: billingInfo.first_name.value,
    surname: billingInfo.surname.value,
    company_name: billingInfo.company_name.value,
    company_id: billingInfo.company_id.value,
    vat_number: billingInfo.vat_number.value,
    street: billingInfo.street.value,
    city: billingInfo.city.value,
    postal_code: billingInfo.postal_code.value,
    country: billingInfo.country.value,
  };
};

const validateInitialState = (value: string) =>
  value !== "" && value !== undefined;

export const billingInfoInitialData = (
  billingInfo: IBillingInfo,
  setter: Dispatch<SetStateAction<IBillingInfoFormProps>>
): IBillingInfoFormProps => {
  /**
   * Purpose of this function is to take the billing info from the API and
   * convert it into the format that the BillingInfoForm component expects.
   * */

  const { t } = useTranslation("common");

  return {
    first_name: {
      value: billingInfo.first_name,
      isValid: validateInitialState(billingInfo.first_name) ? true : undefined,
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
      errorMessage: `${t("first-name-required-error-message")}`,
      label: `${t("first-name-label")}`,
    },
    surname: {
      value: billingInfo.surname,
      isValid: validateInitialState(billingInfo.surname) ? true : undefined,
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
      errorMessage: `${t("surname-required-error-message")}`,
      label: `${t("surname-label")}`,
    },
    company_name: {
      value: billingInfo.company_name,
      isValid: true,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          company_name: { ...prevState.company_name, value },
        })),
      isRequired: false,
      label: `${t("company-name-label")}`,
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
      label: `${t("company-id-label")}`,
    },
    vat_number: {
      value: billingInfo.vat_number,
      isValid: true,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          vat_number: { ...prevState.vat_number, value },
        })),
      isRequired: false,
      label: `${t("vat-number-label")}`,
    },
    street: {
      value: billingInfo.street,
      isValid: validateInitialState(billingInfo.street) ? true : undefined,
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
      errorMessage: `${t("street-required-error-message")}`,
      label: `${t("street-label")}`,
    },
    city: {
      value: billingInfo.city,
      isValid: validateInitialState(billingInfo.city) ? true : undefined,
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
      errorMessage: `${t("city-required-error-message")}`,
      label: `${t("city-label")}`,
    },
    postal_code: {
      value: billingInfo.postal_code,
      isValid: validateInitialState(billingInfo.postal_code) ? true : undefined,
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
      errorMessage: `${t("postal-code-required-error-message")}`,
      label: `${t("postal-code-label")}`,
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
      errorMessage: `${t("country-required-error-message")}`,
      label: `${t("country-label")}`,
    },
  };
};

interface IBillingInfoFormComponentProps extends IBillingInfoFormProps {
  setIsFormValid: (value: boolean) => void;
  radioType?: "NEW" | "SAMEASSHIPPING" | "PROFILE";
  countryOptions?: ICountryOption[];
  allowCountryChange?: boolean;
}

const BillingInfoForm = (props: IBillingInfoFormComponentProps) => {
  const {
    setIsFormValid,
    radioType,
    countryOptions,
    allowCountryChange = false,
    ...billingInfo
  } = props;

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

  useEffect(() => {
    if (radioType == "SAMEASSHIPPING") {
      setIsFormValid(true);
    } else {
      validateBillingInfo();
    }
  }, [radioType]);

  const validateBillingInfo = useCallback(() => {
    // iterate through the billing info and check if all the fields are valid if they're required
    const billingInfoValues: IValidatedInputField[] =
      Object.values(billingInfo);
    const billingInfoKeys: string[] = Object.keys(billingInfo);

    console.log("billingInfoValues", billingInfoValues);
    for (let i = 0; i < billingInfoValues.length; i++) {
      const value = billingInfoValues[i];
      if (
        value.isRequired &&
        (value.isValid == false || value.isValid == undefined) &&
        !(billingInfoKeys[i] == "country" && allowCountryChange)
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
    <form>
      <TwoFieldsOneRowWrapper>
        <BasicField field={first_name} />
        <BasicField field={surname} />
      </TwoFieldsOneRowWrapper>
      <BasicField field={company_name} />
      <TwoFieldsOneRowWrapper>
        <BasicField field={company_id} />
        <BasicField field={vat_number} />
      </TwoFieldsOneRowWrapper>
      <BasicField field={street} />
      <TwoFieldsOneRowWrapper>
        <BasicField field={city} />
        <BasicField field={postal_code} />
      </TwoFieldsOneRowWrapper>
      {countryOptions && countryOptions?.length > 0 ? (
        <BasicSelect
          field={country}
          options={countryOptions}
          disabled={!allowCountryChange}
        />
      ) : null}
    </form>
  );
};

export default BillingInfoForm;
