import { APIURL } from "./Fetch";
import { axiosPost } from "./Save";

const API_ENDPOINT = APIURL();

var response = "demo";
export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, result } = data;
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      stripeToken: result.paymentMethod.id,
      name: result.paymentMethod.billing_details.name,
      email: result.paymentMethod.billing_details.email,
      amount: amount,
    });
    cb(paymentResponse);
  }
};

// place backend API call for payment
const stripePayment = async (data) => {
  // const url = `${API_ENDPOINT}pay`;
  // axiosPost(url, data).then((res) => {
  //   response = res;
  //   return response;
  // });
  const res = await fetch(`${API_ENDPOINT}pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer NOPLAN@12345!",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};
