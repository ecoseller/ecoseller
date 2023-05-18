import { IBillingInfo } from "@/types/cart";
import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";

export interface IValidatedInputField {
  value: string;
  isValid?: boolean;
  setter: (value: string) => void;
  setIsValid?: (value: boolean) => void;
  validator?: (value: string) => boolean;
  isRequired?: boolean;
  errorMessage?: string;
  label?: string;
}

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
        <TextField
          id="first-name"
          label={first_name.label}
          variant="outlined"
          value={first_name.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            first_name.setter(e.target.value);
            if (first_name.validator && first_name.setIsValid) {
              first_name.setIsValid(first_name.validator(e.target.value));
            }
          }}
          error={first_name.isValid === false}
          helperText={!first_name.isValid ? first_name.errorMessage : ""}
        />
        <TextField
          id="surname"
          label="Surname"
          variant="outlined"
          value={surname.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            surname.setter(e.target.value);
            if (surname.validator && surname.setIsValid) {
              surname.setIsValid(surname.validator(e.target.value));
            }
          }}
          error={surname.isValid === false}
          helperText={!surname.isValid ? surname.errorMessage : ""}
        />
        <TextField
          id="company-name"
          label={company_name.label}
          variant="outlined"
          value={company_name.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            company_name.setter(e.target.value);
            if (company_name.validator && company_name.setIsValid) {
              company_name.setIsValid(company_name.validator(e.target.value));
            }
          }}
          error={company_name.isValid === false}
          helperText={!company_name.isValid ? company_name.errorMessage : ""}
        />
        <TextField
          id="company-id"
          label={company_id.label}
          variant="outlined"
          value={company_id.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            company_id.setter(e.target.value);
            if (company_id.validator && company_id.setIsValid) {
              company_id.setIsValid(company_id.validator(e.target.value));
            }
          }}
          error={company_id.isValid === false}
          helperText={!company_id.isValid ? company_id.errorMessage : ""}
        />
        <TextField
          id="vat-number"
          label={vat_number.label}
          variant="outlined"
          value={vat_number.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            vat_number.setter(e.target.value);
            if (vat_number.validator && vat_number.setIsValid) {
              vat_number.setIsValid(vat_number.validator(e.target.value));
            }
          }}
        />
        <TextField
          id="street"
          label={street.label}
          variant="outlined"
          value={street.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            street.setter(e.target.value);
            if (street.validator && street.setIsValid) {
              street.setIsValid(street.validator(e.target.value));
            }
          }}
          error={street.isValid === false}
          helperText={!street.isValid ? street.errorMessage : ""}
        />
        <TextField
          id="city"
          label={city.label}
          variant="outlined"
          value={city.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            city.setter(e.target.value);
            if (city.validator && city.setIsValid) {
              city.setIsValid(city.validator(e.target.value));
            }
          }}
          error={city.isValid === false}
          helperText={!city.isValid ? city.errorMessage : ""}
        />
        <TextField
          id="postal-code"
          label={postal_code.label}
          variant="outlined"
          value={postal_code.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            postal_code.setter(e.target.value);
            if (postal_code.validator && postal_code.setIsValid) {
              postal_code.setIsValid(postal_code.validator(e.target.value));
            }
          }}
          error={postal_code.isValid === false}
          helperText={!postal_code.isValid ? postal_code.errorMessage : ""}
        />
        <TextField
          id="country"
          label={country.label}
          variant="outlined"
          value={country.value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
            country.setter(e.target.value)
          }
          error={country.isValid === false}
          helperText={!country.isValid ? country.errorMessage : ""}
        />
      </form>
    </div>
  );
};

export default BillingInfoForm;
