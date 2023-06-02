import React, { Dispatch, SetStateAction } from "react";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import BasicField, {
  BasicSelect,
  IBasicFieldProps,
  TwoFieldsOneRowWrapper,
} from "../../Generic/Forms/BasicField";
import { IShippingInfo } from "@/types/cart/cart";
import { ICountryBase } from "@/types/country";
import { usePermission } from "@/utils/context/permission";

export interface IShippingInfoFormProps {
  first_name: IBasicFieldProps;
  surname: IBasicFieldProps;
  email: IBasicFieldProps;
  phone: IBasicFieldProps;
  additional_info: IBasicFieldProps;
  street: IBasicFieldProps;
  city: IBasicFieldProps;
  postal_code: IBasicFieldProps;
  country: IBasicFieldProps;
}

export const shippingInfoInitialData = (
  shippingInfo: IShippingInfo,
  setter: Dispatch<SetStateAction<IShippingInfo>>,
  editable: boolean
): IShippingInfoFormProps => {
  /**
   * Purpose of this function is to take the shipping info from the API and
   * convert it into the format that the ShippingInfo component expects.
   * */

  return {
    first_name: {
      value: shippingInfo.first_name,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          first_name: value,
        })),
      isRequired: true,
      label: "First name",
      disabled: !editable,
    },
    surname: {
      value: shippingInfo.surname,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          surname: value,
        })),
      isRequired: true,
      label: "Surname",
      disabled: !editable,
    },
    email: {
      value: shippingInfo.email,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          email: value,
        })),
      isRequired: true,
      label: "Email",
      disabled: !editable,
    },
    phone: {
      value: shippingInfo.phone,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          phone: value,
        })),
      isRequired: true,
      label: "Phone",
      disabled: !editable,
    },
    additional_info: {
      value: shippingInfo.additional_info,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          additional_info: value,
        })),
      isRequired: false,
      label: "Additional info",
      disabled: !editable,
    },
    street: {
      value: shippingInfo.street,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          street: value,
        })),
      isRequired: true,
      label: "Street",
      disabled: !editable,
    },
    city: {
      value: shippingInfo.city,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          city: value,
        })),
      isRequired: true,
      label: "City",
      disabled: !editable,
    },
    postal_code: {
      value: shippingInfo.postal_code,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          postal_code: value,
        })),
      isRequired: true,
      label: "Postal code",
      disabled: !editable,
    },
    country: {
      value: `${shippingInfo.country}`,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          country: value,
        })),
      isRequired: true,
      label: "Country",
      disabled: true, // can't change shipping country after the order is created
    },
  };
};

interface IOrderDetailShippingInfoProps {
  shippingInfo: IShippingInfo;
  setShippingInfo: Dispatch<SetStateAction<IShippingInfo>>;
  countryOptions: ICountryBase[];
  isEditable: boolean;
}

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
 */
const OrderDetailShippingInfo = ({
  shippingInfo,
  setShippingInfo,
  countryOptions,
  isEditable,
}: IOrderDetailShippingInfoProps) => {
  const { hasPermission } = usePermission();

  const shippingFormData = shippingInfoInitialData(
    shippingInfo,
    setShippingInfo,
    hasPermission && isEditable
  );

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Shipping info">
        <form>
          <TwoFieldsOneRowWrapper>
            <BasicField props={shippingFormData.first_name} />
            <BasicField props={shippingFormData.surname} />
          </TwoFieldsOneRowWrapper>
          <BasicField props={shippingFormData.email} />
          <BasicField props={shippingFormData.phone} />
          <TwoFieldsOneRowWrapper>
            <BasicField props={shippingFormData.street} />
            <BasicField props={shippingFormData.additional_info} />
          </TwoFieldsOneRowWrapper>
          <TwoFieldsOneRowWrapper>
            <BasicField props={shippingFormData.city} />
            <BasicField props={shippingFormData.postal_code} />
          </TwoFieldsOneRowWrapper>

          <BasicSelect
            props={shippingFormData.country}
            options={countryOptions}
          />
        </form>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default OrderDetailShippingInfo;
