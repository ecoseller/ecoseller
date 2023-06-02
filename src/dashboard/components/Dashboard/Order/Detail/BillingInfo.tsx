import { IBillingInfo } from "@/types/cart/cart";

import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import BasicField, {
  BasicSelect,
  IBasicFieldProps,
  TwoFieldsOneRowWrapper,
} from "../../Generic/Forms/BasicField";
import { ICountryBase } from "@/types/country";

export interface IBillingInfoFormProps {
  first_name: IBasicFieldProps;
  surname: IBasicFieldProps;
  company_name: IBasicFieldProps;
  company_id: IBasicFieldProps;
  vat_number: IBasicFieldProps;
  street: IBasicFieldProps;
  city: IBasicFieldProps;
  postal_code: IBasicFieldProps;
  country: IBasicFieldProps;
}

export const exportBillingInfo = (
  billingInfo: IBillingInfoFormProps
): IBillingInfo => {
  /**
   * Purpose of this function is to take the billing info from the BillingInfo component
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

export const billingInfoInitialData = (
  billingInfo: IBillingInfo,
  setter: Dispatch<SetStateAction<IBillingInfoFormProps>>
): IBillingInfoFormProps => {
  /**
   * Purpose of this function is to take the billing info from the API and
   * convert it into the format that the BillingInfo component expects.
   * */

  return {
    first_name: {
      value: billingInfo.first_name,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          first_name: { ...prevState.first_name, value },
        })),
      isRequired: true,
      label: "First name",
    },
    surname: {
      value: billingInfo.surname,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          surname: { ...prevState.surname, value },
        })),
      isRequired: true,
      label: "Surname",
    },
    company_name: {
      value: billingInfo.company_name,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          company_name: { ...prevState.company_name, value },
        })),
      isRequired: false,
      label: "Company name",
    },
    company_id: {
      value: billingInfo.company_id,
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
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          vat_number: { ...prevState.vat_number, value },
        })),
      isRequired: false,
      label: "VAT ID",
    },
    street: {
      value: billingInfo.street,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          street: { ...prevState.street, value },
        })),
      isRequired: true,
      label: "Street",
    },
    city: {
      value: billingInfo.city,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          city: { ...prevState.city, value },
        })),
      isRequired: true,
      label: "City",
    },
    postal_code: {
      value: billingInfo.postal_code,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          postal_code: { ...prevState.postal_code, value },
        })),
      isRequired: true,
      label: "Postal code",
    },
    country: {
      value: `${billingInfo.country}`,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          country: { ...prevState.country, value },
        })),
      isRequired: true,
      label: "Country",
    },
  };
};

interface IBillingInfoFormComponentProps {
  billingInfo: IBillingInfo;
  countryOptions?: ICountryBase[];
}

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
const BillingInfo = ({
  billingInfo,
  countryOptions,
}: IBillingInfoFormComponentProps) => {
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
  } = billingInfoInitialData(billingInfo, null);
  return (
    <form>
      <TwoFieldsOneRowWrapper>
        <BasicField props={first_name} />
        <BasicField props={surname} />
      </TwoFieldsOneRowWrapper>
      <BasicField props={company_name} />
      <TwoFieldsOneRowWrapper>
        <BasicField props={company_id} />
        <BasicField props={vat_number} />
      </TwoFieldsOneRowWrapper>
      <BasicField props={street} />
      <TwoFieldsOneRowWrapper>
        <BasicField props={city} />
        <BasicField props={postal_code} />
      </TwoFieldsOneRowWrapper>
      {countryOptions && countryOptions?.length > 0 ? (
        <BasicSelect props={country} options={countryOptions} />
      ) : null}
    </form>
  );
};

export default BillingInfo;
