const OrderCompleted = ({ id }: { id: string }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <h1>Thank you!</h1>
      <h3>We sent you an e-mail with order confirmation.</h3>
    </div>
  );
};

export default OrderCompleted;
