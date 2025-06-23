import React, { ReactElement, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripeS, faPaypal } from "@fortawesome/free-brands-svg-icons";
import Paypal from "./PaypalComponent";
import StripeComponent from "./StripeComponent";


export function DisplayLocation() {
  let selectRef = useRef<HTMLSelectElement>(null);
  let paypalInterRef = useRef<HTMLDivElement | null>(null);
  let stripeInterRef = useRef<HTMLDivElement | null>(null);

  let firstNameRef = useRef<HTMLInputElement | null>(null);
  let lastNameRef = useRef<HTMLInputElement | null>(null);
  let gmailRef = useRef<HTMLInputElement | null>(null);
  let adressRef = useRef<HTMLInputElement | null>(null);
  let cityRef = useRef<HTMLInputElement | null>(null);

  let errRef = useRef<HTMLDivElement | null>(null);

  let allInfo = [firstNameRef, lastNameRef, gmailRef, adressRef, cityRef];

  let [disabled, setDisabled] = useState(true);
  let [disabledAlert, setDisabledAlert] = useState(false);

  const disabledClasses = ["opacity-55", "pointer-events-none"];

  const gmailPattern = /^[a-zA-Z0-9.]{6,30}@gmail\.com$/;

  useEffect(() => {
    const handleChangeMap = new Map();
    // Initialize values from sessionStorage on mount
    allInfo.forEach((element) => {
      const inputElement = element.current;
      if (inputElement) {
        const storedValue = localStorage.getItem(inputElement.id);
        if (storedValue) {
          inputElement.value = storedValue; // Set initial value from sessionStorage
        }
      }
    });

    
    // Define the handleChange function
    const handleChange = () => {
      const errors = new Set(); // Use a Set to manage unique errors

      
      // Check all inputs for empty values and validate inputs
      allInfo.forEach((element) => {
        const inputElement = element.current;

        if (inputElement) {
          // Update sessionStorage with the current input value
          localStorage.setItem(inputElement.id, inputElement.value);

          // Check for empty input
          if (inputElement.value.trim() === "") {
            errors.add("Fill the empty inputs");
          }

          // Gmail validation check
          if (
            inputElement === gmailRef.current &&
            !gmailPattern.test(inputElement.value)
          ) {
            errors.add("Invalid Gmail");
          }
        }
      });

      // Convert Set to Array for display
      const errorsArray = Array.from(errors);

      // Update error message display
      if (errorsArray.length > 0) {
        const errVal = errorsArray.join(", ");
        setDisabledAlert(false);
        setDisabled(true);
        errRef.current!.textContent = errVal;
      } else {
        setDisabledAlert(true);
        setDisabled(false);
      }
      
    };
    handleChange();

    // Attach event listeners to each element
    allInfo.forEach((element) => {
      const inputElement = element.current;
      if (inputElement) {
        inputElement.addEventListener("input", handleChange); // Use 'input' for real-time feedback
        handleChangeMap.set(inputElement, handleChange); // Save for cleanup
      }
    });

    // Cleanup function to remove event listeners
    return () => {
      handleChangeMap.forEach((handleChange, inputElement) => {
        inputElement.removeEventListener("input", handleChange);
      });
    };
  }, [allInfo]);

  useEffect(() => {
    if (disabledAlert) {
      errRef.current!.style.display = "none";
    } else if (!disabledAlert) {
      errRef.current!.style.display = "block";
    }
  }, [disabledAlert]);
  useEffect(() => {
    if (disabled) {
      disabledClasses.forEach((_class) => {
        paypalInterRef.current?.classList.add(_class);
        stripeInterRef.current?.classList.add(_class);
      });
    } else if (!disabled) {
      disabledClasses.forEach((_class) => {
        paypalInterRef.current?.classList.remove(_class);
        stripeInterRef.current?.classList.remove(_class);
      });
    }
  }, [disabled]);

  useEffect(() => {
    const handleChange = () => {
      if (selectRef.current?.value === "Paypal") {
        if (paypalInterRef.current) {
          paypalInterRef.current.style.display = "block";
        }
        if (stripeInterRef.current) {
          stripeInterRef.current.style.display = "none";
        }
      } else if (selectRef.current?.value === "Stripe") {
        if (stripeInterRef.current) {
          stripeInterRef.current.style.display = "flex";
        }
        if (paypalInterRef.current) {
          paypalInterRef.current.style.display = "none";
        }
      }
    };

    const selectElement = selectRef.current;
    if (selectElement) {
      selectElement.addEventListener("change", handleChange);
    }

    return () => {
      if (selectElement) {
        selectElement.removeEventListener("change", handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (paypalInterRef.current) {
      paypalInterRef.current.style.display = "block"; // Show PayPal
    }
  });
  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Fill the form to pay! We will contact you if anything goes wrong
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
            Shipping Address
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-gray-700 dark:text-white mb-1"
              >
                First Name
              </label>
              <input
                ref={firstNameRef}
                type="text"
                id="first_name"
                className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-gray-700 dark:text-white mb-1"
              >
                Last Name
              </label>
              <input
                ref={lastNameRef}
                type="text"
                id="last_name"
                className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="address"
              className="block text-gray-700 dark:text-white mb-1"
            >
              Address
            </label>
            <input
              ref={adressRef}
              type="text"
              id="address"
              className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="city"
              className="block text-gray-700 dark:text-white mb-1"
            >
              City
            </label>
            <input
              ref={cityRef}
              type="text"
              id="city"
              className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="city"
              className="block text-gray-700 dark:text-white mb-1"
            >
              Gmail
            </label>
            <input
              ref={gmailRef}
              type="text"
              id="gmail"
              className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
        </div>
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium"
          role="alert"
          ref={errRef}
        >
          Fill the empty inputs, Gmail Invalid
        </div>
        <div className="mt-8 gap-3">
          <label
            htmlFor="payment"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
          >
            Pay with
          </label>
          <div>
            <div className="">
              <select
                ref={selectRef}
                id="payment"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={"Paypal"}>Paypal</option>

                <option value="Stripe">Stripe</option>
              </select>
            </div>

            <div>
              <div
                ref={paypalInterRef}
                className="py-4 pointer-events-none opacity-55"
              >
                <Paypal />
              </div>

              <div
                ref={stripeInterRef}
                style={{ display: "none" }}
                className="py-4 flex justify-center  pointer-events-none opacity-55"
              >
                <StripeComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
