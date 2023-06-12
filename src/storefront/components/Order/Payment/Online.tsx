interface IOnlinePaymentProps {
  qr_code: string;
  payment_id: string;
  payment_url: string;
}
const OnlinePayment = ({
  qr_code,
  payment_id,
  payment_url,
}: IOnlinePaymentProps) => {
  return <>Online Payment</>;
};

export default OnlinePayment;
