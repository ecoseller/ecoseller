import { IBillingInfo } from "@/types/cart/cart";
import React, { Dispatch, SetStateAction } from "react";
import BasicField, {
  BasicSelect,
  IBasicFieldProps,
  TwoFieldsOneRowWrapper,
} from "../../Generic/Forms/BasicField";
import { ICountryBase } from "@/types/country";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { usePermission } from "@/utils/context/permission";

interface IBillingInfoFormProps {
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

interface IOrderDetailBillingInfoProps {
  billingInfo: IBillingInfo;
  setBillingInfo: Dispatch<SetStateAction<IBillingInfo>>;
  countryOptions: ICountryBase[];
  isEditable: boolean;
  preventNavigation: () => void;
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
 */
const OrderDetailBillingInfo = ({
  billingInfo,
  setBillingInfo,
  countryOptions,
  isEditable,
  preventNavigation,
}: IOrderDetailBillingInfoProps) => {
  const { hasPermission } = usePermission();

  const editableForms = isEditable && hasPermission;

  const getFormData = (): IBillingInfoFormProps => {
    /**
     * Purpose of this function is to take the billing info from the API and
     * convert it into the format that the OrderDetailBillingInfo component expects.
     * */
    return {
      first_name: {
        value: billingInfo.first_name,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
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
        value: billingInfo.surname,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
            ...prevState,
            surname: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Surname",
        disabled: !editableForms,
      },
      company_name: {
        value: billingInfo.company_name,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
            ...prevState,
            company_name: value,
          }));
          preventNavigation();
        },
        isRequired: false,
        label: "Company name",
        disabled: !editableForms,
      },
      company_id: {
        value: billingInfo.company_id,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
            ...prevState,
            company_id: value,
          }));
          preventNavigation();
        },
        isRequired: false,
        label: "Company ID",
        disabled: !editableForms,
      },
      vat_number: {
        value: billingInfo.vat_number,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
            ...prevState,
            vat_number: value,
          }));
          preventNavigation();
        },
        isRequired: false,
        label: "VAT ID",
        disabled: !editableForms,
      },
      street: {
        value: billingInfo.street,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
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
        value: billingInfo.city,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
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
        value: billingInfo.postal_code,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
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
        value: `${billingInfo.country}`,
        setter: (value: string) => {
          setBillingInfo((prevState) => ({
            ...prevState,
            country: value,
          }));
          preventNavigation();
        },
        isRequired: true,
        label: "Country",
        disabled: !editableForms,
      },
    };
  };

  const billingFormData = getFormData();

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
          <BasicSelect
            props={billingFormData.country}
            options={countryOptions}
          />
        </form>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default OrderDetailBillingInfo;
