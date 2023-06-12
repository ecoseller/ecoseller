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
      <p>Payment details:</p>
      <table>
        <tbody>
          {payment_data?.amount && payment_data.currency ? (
            <tr>
              <td>
                <b>Amount</b>
              </td>
              <td>
                {payment_data.amount} {payment_data.currency}
              </td>
            </tr>
          ) : null}
          {payment_data?.reference ? (
            <tr>
              <td>
                <b>Reference</b>
              </td>
              <td>{payment_data.reference}</td>
            </tr>
          ) : null}
          {payment_data?.iban ? (
            <tr>
              <td>
                <b>IBAN</b>
              </td>
              <td>{payment_data.iban}</td>
            </tr>
          ) : null}
          {payment_data?.bic ? (
            <tr>
              <td>
                <b>BIC</b>
              </td>
              <td>{payment_data.bic}</td>
            </tr>
          ) : null}
          {payment_data?.bank_account ? (
            <tr>
              <td>
                <b>Bank account</b>
              </td>
              <td>{payment_data.bank_account}</td>
            </tr>
          ) : null}
          {qr_code ? (
            <tr>
              <td>
                <b>QR</b>
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
