"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { shopCartType } from "./Shopcart";
import { DisplayData } from "@/app/components/steps/DisplayData";
import { DisplayLocation } from "@/app/components/steps/DisplayLocation";
import { useCart } from "../context/CartContext";


export type AmountType = {
  title: string;
  amount: number;
};

export type ModalType = {
  items: shopCartType[];
  amounts: AmountType[];
};

export function getFinalTotal(items: any): number {
  let { allamount } = useCart();
  return allamount.reduce((total, _itemAmount: AmountType, index) => {
    const item = items.find(
      (item: shopCartType) => item.title === _itemAmount.title
    );

    if (item && item.price != null) {
      const addedAmount = item.price * _itemAmount.amount;

      return total + addedAmount;
    }

    return total;
  }, 0);
}

export function Modal({ items, amounts }: ModalType) {
 

  const [currentStep, setCurrentStep] = useState(0);
  let closeBtn = useRef<HTMLButtonElement>(null);
  let shopModal = useRef<HTMLDivElement>(null);

  const steps = [
    <DisplayData items={items} amounts={amounts} />,
    <DisplayLocation />,
  ];

  function handleIncAndDec(add: boolean) {
    if (add && currentStep !== steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep !== 0 && add == false) {
      setCurrentStep((prev) => prev - 1);
    }

    if (add === false) {
      handleViewModal();
    }
  }

  function handleViewModal() {
    if (currentStep === 0) {
      shopModal.current!.style.display = "none";
    } else if (currentStep < 0) {
      shopModal.current!.style.display = "flex";
    }
  }

  function handleClose() {
    shopModal.current!.style.display = "none";
    setCurrentStep(0);
  }
  return (
    <>
      <div
        id="shopModal"
        tabIndex={-1}
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full modal-anim"
        ref={shopModal}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="leading-relaxed text-blackdark:text-gray-400 text-lg">
                {currentStep + 1} / {steps.length}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleClose()}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {steps[currentStep]}

            {getFinalTotal(items) === 0 && (
              <div className="p-4 md:p-5 space-y-4 flex justify-center">
                <h1 className="fs-6 text-red-700 font-bold text-lg">
                  Empty Order...
                </h1>
              </div>
            )}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-4">
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => handleIncAndDec(false)}
                ref={closeBtn}
              >
                {currentStep >= 1 && <a>Back</a>}
                {currentStep === 0 && <a>Cancel</a>}
              </button>
              {getFinalTotal(items) !== 0 &&
                steps.length > 1 &&
                currentStep !== steps.length - 1 && (
                  <>
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => handleIncAndDec(true)}
                    >
                      Next
                    </button>
                  </>
                )}

              <div className="ml-auto">
                <p className="leading-relaxed text-blackdark:text-gray-400 text-lg">
                  <span className="text-black font-bold">Total:</span>

                  <span> </span>
                  <span>{getFinalTotal(items)}</span>

                  <span> SEK</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
