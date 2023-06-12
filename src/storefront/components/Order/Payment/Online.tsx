import Button from "@mui/material/Button";
import { useRouter } from "next/router";

interface IOnlinePaymentProps {
  payment_id: string;
  payment_url: string;
}
const OnlinePayment = ({ payment_id, payment_url }: IOnlinePaymentProps) => {
  const router = useRouter();
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
      <p>
        Since you selected online payment, please click the button below and you
        will be redirected.
      </p>
      <Button
        onClick={() => {
          router.push(payment_url);
        }}
      >
        Pay now
      </Button>
    </div>
  );
};

export default OnlinePayment;
