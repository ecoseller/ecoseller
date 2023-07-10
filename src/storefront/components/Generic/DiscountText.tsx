import { useTranslation } from "next-i18next";

interface IDiscountTextProps {
  discount: number;
  includeUpTo?: boolean;
}

/**
 * Component displaying red colored discount
 * @param discount discount in percentages
 * @param includeUpTo add "up to" text before the discount percentage
 * @constructor
 */
const DiscountText = ({
  discount,
  includeUpTo = false,
}: IDiscountTextProps) => {
  const { t } = useTranslation();
  return (
    <span
      className="red-text"
      style={{
        fontSize: "0.8rem",
      }}
    >
      ({includeUpTo ? t("up-to") : null}-{discount} %)
    </span>
  );
};

export default DiscountText;
