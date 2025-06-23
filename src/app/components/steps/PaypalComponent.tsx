import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Import PayPalButtons
import dotenv from "dotenv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

dotenv.config();

const _clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
function Message({ content }: any) {
  return <p>{content}</p>;
}

function App() {
  const router = useRouter();
  const initialOptions = {
    clientId: _clientId,
    currency: "SEK",
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "SE",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const [message, setMessage] = useState("");

  let { allamount } = useCart();

  return (
    <div className="App h-50 w-50">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={async (data, actions) => {
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cart: allamount,
              }),
            });

            if (!response.ok) {
              console.error(
                "Failed to create order:",
                response.status,
                response.statusText
              );
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const orderData = await response.json();
            return orderData.id; // Return the order ID to PayPal
          }}
          onApprove={async (data, actions) => {
            const captureResponse = await fetch(
              `/api/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstName: localStorage.getItem("first_name"),
                  lastName: localStorage.getItem("last_name"),
                  email: localStorage.getItem("gmail"),
                  address: localStorage.getItem("address"),
                  city: localStorage.getItem("city"),
                  allamount: allamount,
                }),
              }
            );

           

            const captureData = await captureResponse.json();
            const errorDetail = captureData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              return setMessage("Payment was declined. Please try again.");
            } else if (errorDetail) {
              throw new Error(
                `${errorDetail.description} (${captureData.debug_id})`
              );
            } else {
              const transaction =
                captureData.purchase_units[0].payments.captures[0];
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
              );
              console.log(
                "Capture result",
                captureData,
                JSON.stringify(captureData, null, 2)
              );
              router.push("/pages/success");
            }
          }}
          onError={(err) => {
            console.error("PayPal Button Error:", err);
            setMessage("An error occurred with PayPal.");
            router.push("/pages/failure");
          }}
        />
        <Message content={message} />
      </PayPalScriptProvider>
    </div>
  );
}

export default App;
