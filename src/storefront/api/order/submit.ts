export const orderSubmitAPI = async (
  token: string,
  data: {
    agreeWithTerms: boolean;
    agreeWithDataProcessing: boolean;
  },
  session_id: string | undefined
) => {
  return await fetch(`/api/order/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_token: token,
      marketing_flag: data.agreeWithDataProcessing,
      agreed_to_terms: data.agreeWithTerms,
      session_id: session_id,
    }),
  });
};
