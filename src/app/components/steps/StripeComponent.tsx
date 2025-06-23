import Stripe from 'stripe';
import { useCart } from "@/app/context/CartContext";
import { faStripeS } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadStripe } from "@stripe/stripe-js";
import menuData from "@/app/menuData.json";
import React, { useEffect } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeComponent() {
  const { allamount } = useCart();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    const _items = allamount
      .map((item, index) => {
        if (item.amount > 0) {
          return {
            name: item.title,
            unitAmount: {
              currencyCode: "SEK",
              value: menuData[index].price.toString(), // Keep price in SEK
            },
            quantity: item.amount.toString(),
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  
    if (_items.length === 0) {
      console.error("No items in the cart to submit.");
      return; // Avoid making a request with empty items
    }
  
    const total = allamount.reduce((accumulatedTotal, item, index) => {
      return accumulatedTotal + item.amount * menuData[index].price;
    }, 0); // Total is in SEK
  
    console.log("Total amount (in SEK):", total); // Log total amount in SEK
  
    if (total < 3.00) {
      console.error("Total amount must be at least 3.00 SEK. Current total:", total);
      return; // Don't proceed with the request
    }
  
    const stripe = await stripePromise;

    // Gather data from local storage
    const firstName = localStorage.getItem("first_name") || '';
    const lastName = localStorage.getItem("last_name") || '';
    const email = localStorage.getItem("gmail") || '';
    const address = localStorage.getItem("address") || '';
    const city = localStorage.getItem("city") || '';

    // Call your backend to create the Checkout Session
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total: total * 100, // Convert total to öre for Stripe
        items: _items,
        customer: {
          firstName,
          lastName,
          email,
          address,
          city,
        },
      }),
    });
  
    if (response.ok) {
      const session = await response.json();
      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.error(result.error.message);
      }
    } else {
      const errorData = await response.json();
      console.error("Failed to create a checkout session:", errorData.error);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <section>
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-900 w-full"
            role="link"
          >
            Stripe <FontAwesomeIcon icon={faStripeS} />
          </button>
        </section>
      </form>
    </div>
  );
}
