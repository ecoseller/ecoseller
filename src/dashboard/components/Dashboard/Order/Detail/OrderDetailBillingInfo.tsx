import { IBillingInfo } from "@/types/cart/cart";

import TextField from "@mui/material/TextField";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import BasicField, {
  BasicSelect,
  IBasicFieldProps,
  TwoFieldsOneRowWrapper,
} from "../../Generic/Forms/BasicField";
import { ICountryBase } from "@/types/country";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { usePermission } from "@/utils/context/permission";

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
   * Purpose of this function is to take the billing info from the OrderDetailBillingInfo component
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
  setter: Dispatch<SetStateAction<IBillingInfo>>,
  editable: boolean
): IBillingInfoFormProps => {
  /**
   * Purpose of this function is to take the billing info from the API and
   * convert it into the format that the OrderDetailBillingInfo component expects.
   * */

  return {
    first_name: {
      value: billingInfo.first_name,
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
      value: billingInfo.surname,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          surname: value,
        })),
      isRequired: true,
      label: "Surname",
      disabled: !editable,
    },
    company_name: {
      value: billingInfo.company_name,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          company_name: value,
        })),
      isRequired: false,
      label: "Company name",
      disabled: !editable,
    },
    company_id: {
      value: billingInfo.company_id,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          company_id: value,
        })),
      isRequired: false,
      label: "Company ID",
      disabled: !editable,
    },
    vat_number: {
      value: billingInfo.vat_number,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          vat_number: value,
        })),
      isRequired: false,
      label: "VAT ID",
      disabled: !editable,
    },
    street: {
      value: billingInfo.street,
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
      value: billingInfo.city,
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
      value: billingInfo.postal_code,
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
      value: `${billingInfo.country}`,
      setter: (value: string) =>
        setter((prevState) => ({
          ...prevState,
          country: value,
        })),
      isRequired: true,
      label: "Country",
      disabled: !editable,
    },
  };
};

interface IOrderDetailBillingInfoProps {
  billingInfo: IBillingInfo;
  countryOptions?: ICountryBase[];
  isEditable: boolean;
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
const OrderDetailBillingInfo = ({
  billingInfo,
  countryOptions,
  isEditable,
}: IOrderDetailBillingInfoProps) => {
  const { hasPermission } = usePermission();

  const [billingInfoState, setBillingInfoState] = useState(billingInfo);

  const billingFormData = billingInfoInitialData(
    billingInfoState,
    setBillingInfoState,
    hasPermission && isEditable
  );

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Billing info">
        <form>
          <TwoFieldsOneRowWrapper>
            <BasicField props={billingFormData.first_name} />
            <BasicField props={billingFormData.surname} />
          </TwoFieldsOneRowWrapper>
          <BasicField props={billingFormData.company_name} />
          <TwoFieldsOneRowWrapper>
            <BasicField props={billingFormData.company_id} />
            <BasicField props={billingFormData.vat_number} />
          </TwoFieldsOneRowWrapper>
          <BasicField props={billingFormData.street} />
          <TwoFieldsOneRowWrapper>
            <BasicField props={billingFormData.city} />
            <BasicField props={billingFormData.postal_code} />
          </TwoFieldsOneRowWrapper>
          {countryOptions && countryOptions?.length > 0 ? (
            <BasicSelect
              props={billingFormData.country}
              options={countryOptions}
            />
          ) : null}
        </form>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default OrderDetailBillingInfo;
