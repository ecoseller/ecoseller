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

interface IShippingInfoFormProps {
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

interface IOrderDetailShippingInfoProps {
  shippingInfo: IShippingInfo;
  setShippingInfo: Dispatch<SetStateAction<IShippingInfo>>;
  countryOptions: ICountryBase[];
  isEditable: boolean;
  preventNavigation: () => void;
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
 */
const OrderDetailShippingInfo = ({
  shippingInfo,
  setShippingInfo,
  countryOptions,
  isEditable,
  preventNavigation,
}: IOrderDetailShippingInfoProps) => {
  const { hasPermission } = usePermission();

  const editableForms = hasPermission && isEditable;

  /**
   * Purpose of this function is to take the shipping info from the API and
   * convert it into the format that the ShippingInfo component expects.
   * */
  const shippingInfoInitialData = (): IShippingInfoFormProps => {
    return {
      first_name: {
        value: shippingInfo.first_name,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            first_name: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "First name",
        disabled: !editableForms,
      },
      surname: {
        value: shippingInfo.surname,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            surname: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Surname",
        disabled: !editableForms,
      },
      email: {
        value: shippingInfo.email,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            email: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Email",
        disabled: !editableForms,
      },
      phone: {
        value: shippingInfo.phone,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            phone: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Phone",
        disabled: !editableForms,
      },
      additional_info: {
        value: shippingInfo.additional_info,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            additional_info: value,
          }));
          preventNavigation();
        },
        isRequired: false,
        label: "Additional info",
        disabled: !editableForms,
      },
      street: {
        value: shippingInfo.street,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            street: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Street",
        disabled: !editableForms,
      },
      city: {
        value: shippingInfo.city,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            city: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "City",
        disabled: !editableForms,
      },
      postal_code: {
        value: shippingInfo.postal_code,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            postal_code: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Postal code",
        disabled: !editableForms,
      },
      country: {
        value: `${shippingInfo.country}`,
        setter: (value: string) => {
          setShippingInfo((prevState) => ({
            ...prevState,
            country: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Country",
        disabled: true, // can't change shipping country after the order is created
      },
    };
  };

  const shippingFormData = shippingInfoInitialData();

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
