import { IShippingInfo } from "@/types/cart";
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
      validator: (value: string) => value.length > 0,
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
    <div className="shipping-info-form">
      <h2>Shipping information</h2>
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
          id="email"
          label="Email"
          variant="outlined"
          value={email.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            email.setter(e.target.value);
            if (email.validator && email.setIsValid) {
              email.setIsValid(email.validator(e.target.value));
            }
          }}
          error={email.isValid === false}
          helperText={!email.isValid ? email.errorMessage : ""}
        />
        <TextField
          id="phone"
          label={phone.label}
          variant="outlined"
          value={phone.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            phone.setter(e.target.value);
            if (phone.validator && phone.setIsValid) {
              phone.setIsValid(phone.validator(e.target.value));
            }
          }}
          error={phone.isValid === false}
          helperText={!phone.isValid ? phone.errorMessage : ""}
        />
        <TextField
          id="additional-info"
          label={additional_info.label}
          variant="outlined"
          value={additional_info.value}
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            additional_info.setter(e.target.value);
            if (additional_info.validator && additional_info.setIsValid) {
              additional_info.setIsValid(
                additional_info.validator(e.target.value)
              );
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

export default ShippingInfoForm;
