export const getMerchantSessionKey = () => {
  return fetch("https://pi-test.sagepay.com/api/v1/merchant-session-keys", {
    method: "POST",
    headers: {
      Authorization:
        "Basic TFpvRGtEa0N0WTVMNXBibUoza1JYZm0ycjE2T1VQc0lsdnRyWFZLSzJENjhlUTFXZVk6Mlp3RG1MV1N5MEg1UnBLVEtuVUlMNFFXWnFjVXVFc3d4M0sxQVdtcVFRRGo3dkJGRTlvb3JZMUN1eGdQTXM4SzQ=",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      vendorName: "poptelecom",
    }),
  });
};
export const getCardIdentifier = (merchantSessionKey, cardDetails) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${merchantSessionKey}`);

  var raw = JSON.stringify({
    cardDetails: {
      ...cardDetails,
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    "https://pi-test.sagepay.com/api/v1/card-identifiers",
    requestOptions
  );
};
export const paymentApi = (
  merchantSessionKey,
  cardIdentifier,
  userDetails,
  transactionCode,
  upfrontPayment
) => {
  var address = userDetails.address.split(",");
  var length = address.length;
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append(
    "Authorization",
    "Basic TFpvRGtEa0N0WTVMNXBibUoza1JYZm0ycjE2T1VQc0lsdnRyWFZLSzJENjhlUTFXZVk6Mlp3RG1MV1N5MEg1UnBLVEtuVUlMNFFXWnFjVXVFc3d4M0sxQVdtcVFRRGo3dkJGRTlvb3JZMUN1eGdQTXM4SzQ="
  );
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    transactionType: "Payment",
    paymentMethod: {
      card: {
        merchantSessionKey: merchantSessionKey,
        cardIdentifier: cardIdentifier,
        reusable: false,
        save: false,
      },
    },
    vendorTxCode: transactionCode,
    amount: Math.round(Number(upfrontPayment)),
    currency: "GBP",
    description: "Demo Payment",
    customerFirstName: userDetails.first_name,
    customerLastName:
      userDetails.last_name != "" ? userDetails.last_name : "last name",
    billingAddress: {
      address1: address[length - 3],
      city: address[length - 2],
      postalCode: address[length - 1],
      country: "GB",
    },
    entryMethod: "Ecommerce",
    customerEmail: userDetails.email,
    customerPhone: Number(userDetails.mobile_number),
    shippingDetails: {
      recipientFirstName: userDetails.first_name,
      recipientLastName:
        userDetails.last_name != "" ? userDetails.last_name : "last name",
      shippingAddress1: address[length - 3],
      shippingCity: address[length - 2],
      shippingPostalCode: address[length - 1],
      shippingCountry: "GB",
      shippingState: "st",
    },
    strongCustomerAuthentication: {
      notificationURL: "https://mydomain.com",
      browserIP: "117.211.75.19",
      browserAcceptHeader: "\\*/\\*",
      browserJavascriptEnabled: false,
      browserJavaEnabled: false,
      browserLanguage: "string",
      browserUserAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0",
      challengeWindowSize: "Small",
      transType: "GoodsAndServicePurchase",
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    "https://pi-test.sagepay.com/api/v1/transactions",
    requestOptions
  );
};
