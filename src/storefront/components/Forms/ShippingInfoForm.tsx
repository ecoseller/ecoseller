import { IShippingInfo } from "@/types/cart";
import { IValidatedInputField } from "@/types/common";
import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import BasicFields from "./BasicField";
import BasicField from "./BasicField";

export interface IShippingInfoFormProps {
  first_name: IValidatedInputField;
  surname: IValidatedInputField;
  email: IValidatedInputField;
  phone: IValidatedInputField;
  additional_info: IValidatedInputField;
  street: IValidatedInputField;
  city: IValidatedInputField;
  postal_code: IValidatedInputField;
  country: IValidatedInputField;
}

export const shippingInfoInitialData = (
  shippingInfo: IShippingInfo,
  setter: Dispatch<SetStateAction<IShippingInfoFormProps>>
): IShippingInfoFormProps => {
  /**
   * Purpose of this function is to take the shipping info from the API and
   * convert it into the format that the ShippingInfoForm component expects.
   * */

  return {
    first_name: {
      value: shippingInfo.first_name,
      isValid: shippingInfo.first_name != "" ? true : undefined,
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
      value: shippingInfo.surname,
      isValid: shippingInfo.surname != "" ? true : undefined,
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
    email: {
      value: shippingInfo.email,
      isValid: shippingInfo.email != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          email: { ...prevState.email, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          email: { ...prevState.email, value },
        })),
      validator: (value: string) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(value);
      },
      isRequired: true,
      errorMessage: "Email is required",
      label: "Email",
    },
    phone: {
      value: shippingInfo.phone,
      isValid: shippingInfo.phone != "" ? true : undefined,
      setIsValid: (value: boolean) =>
        setter((prevState) => ({
          ...prevState,
          phone: { ...prevState.phone, isValid: value },
        })),
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          phone: { ...prevState.phone, value },
        })),
      validator: (value: string) => {
        const phoneRegex = /^\d+$/;
        return phoneRegex.test(value);
      },
      isRequired: true,
      errorMessage: "Phone is required",
      label: "Phone",
    },
    additional_info: {
      value: shippingInfo.additional_info,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          additional_info: { ...prevState.additional_info, value },
        })),
      isRequired: false,
      label: "Additional info",
    },
    street: {
      value: shippingInfo.street,
      isValid: shippingInfo.street != "" ? true : undefined,
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
      value: shippingInfo.city,
      isValid: shippingInfo.city != "" ? true : undefined,
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
      value: shippingInfo.postal_code,
      isValid: shippingInfo.postal_code != "" ? true : undefined,
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
      value: `${shippingInfo.country}`,
      isValid: `${shippingInfo.country}` != "" ? true : undefined,
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

interface IShippingInfoFormComponentProps extends IShippingInfoFormProps {
  setIsFormValid: (value: boolean) => void;
}

export const exportShippingInfo = (
  shippingInfo: IShippingInfoFormProps
): IShippingInfo => {
  return {
    first_name: shippingInfo.first_name.value,
    surname: shippingInfo.surname.value,
    email: shippingInfo.email.value,
    phone: shippingInfo.phone.value,
    additional_info: shippingInfo.additional_info.value,
    street: shippingInfo.street.value,
    city: shippingInfo.city.value,
    postal_code: shippingInfo.postal_code.value,
    country: shippingInfo.country.value,
  };
};

const ShippingInfoForm = (props: IShippingInfoFormComponentProps) => {
  const { setIsFormValid, ...shippingInfo } = props;

  /**
   * Purpose of this component is to display the shipping information form
   * and have it be pre-populated with the shipping information if it exists.
   *
   * It should be a form with header "Shipping information" and the following fields:
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

  const validateShippingInfo = useCallback(() => {
    // iterate through the shipping info and check if all the fields are valid if they're required
    const shippingInfoValues: IValidatedInputField[] =
      Object.values(shippingInfo);
    for (let i = 0; i < shippingInfoValues.length; i++) {
      const value = shippingInfoValues[i];
      if (
        value.isRequired &&
        (value.isValid == false || value.isValid == undefined)
      ) {
        setIsFormValid(false);
        return;
      }
    }
    if (shippingInfoValues.length === 0) {
      setIsFormValid(false);
      return;
    }
    setIsFormValid(true);
  }, [shippingInfo]);

  useEffect(() => {
    validateShippingInfo();
  }, [shippingInfo]);

  const {
    first_name,
    surname,
    email,
    phone,
    additional_info,
    street,
    city,
    postal_code,
    country,
  } = shippingInfo;

  return (
    <form>
      <BasicField field={first_name} />
      <BasicField field={surname} />
      <BasicField field={email} />
      <BasicField field={phone} />
      <BasicField field={additional_info} />
      <BasicField field={street} />
      <BasicField field={city} />
      <BasicField field={postal_code} />
      <BasicField field={country} />
    </form>
  );
};

export default ShippingInfoForm;
