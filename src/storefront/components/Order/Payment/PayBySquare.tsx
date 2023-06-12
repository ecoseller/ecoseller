interface IPayBySquareProps {
  qr_code: string;
  payment_id: string;
  payment_data: {
    amount: number;
    currency: string;
    variable_symbol: string;
    iban: string;
    bic: string;
  };
}
const PayBySquare = ({
  qr_code,
  payment_id,
  payment_data,
}: IPayBySquareProps) => {
  return <>Pay by square</>;
};

export default PayBySquare;
