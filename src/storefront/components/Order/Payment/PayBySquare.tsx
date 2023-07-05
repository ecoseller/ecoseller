// utils
import { useTranslation } from "next-i18next";
interface IPayBySquareProps {
  qr_code: string;
  payment_id: string;
  payment_data: {
    bank_account?: string;
    amount: number;
    currency: string;
    reference: string;
    iban: string;
    bic: string;
  };
}
const PayBySquare = ({
  qr_code,
  payment_id,
  payment_data,
}: IPayBySquareProps) => {
  const { t } = useTranslation("order");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30vh",
      }}
    >
      <p>{t("payment-details-title")}:</p>
      <table>
        <tbody>
          {payment_data?.amount && payment_data.currency ? (
            <tr>
              <td>
                <b>{t("amount-label")}</b>
              </td>
              <td>
                {payment_data.amount} {payment_data.currency}
              </td>
            </tr>
          ) : null}
          {payment_data?.reference ? (
            <tr>
              <td>
                <b>{t("reference-label")}</b>
              </td>
              <td>{payment_data.reference}</td>
            </tr>
          ) : null}
          {payment_data?.iban ? (
            <tr>
              <td>
                <b>{t("iban-label")}</b>
              </td>
              <td>{payment_data.iban}</td>
            </tr>
          ) : null}
          {payment_data?.bic ? (
            <tr>
              <td>
                <b>{t("bic-label")}</b>
              </td>
              <td>{payment_data.bic}</td>
            </tr>
          ) : null}
          {payment_data?.bank_account ? (
            <tr>
              <td>
                <b>{t("bank-account-label")}</b>
              </td>
              <td>{payment_data.bank_account}</td>
            </tr>
          ) : null}
          {qr_code ? (
            <tr>
              <td>
                <b>{t("qr-label")}</b>
              </td>
              <td>
                <img
                  src={`data:image/png;base64, ${qr_code}`}
                  alt="Pay by square"
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default PayBySquare;
