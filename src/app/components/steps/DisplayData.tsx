"use client";

import React from "react";
import { getFinalTotal, ModalType } from "../Modal";
import { shopCartType } from "../Shopcart";

import { useCart } from "@/app/context/CartContext";

export function DisplayData({ items, amounts }: ModalType) {
  let { allamount } = useCart();
  
  return (
    <>
      {getFinalTotal(items) !== 0 && (
        <div className="p-4 md:p-5 space-y-4 item-anim">
          <p className="text-base leading-relaxed font-bold text-black">
            The Order:
          </p>

          {items.map((item: shopCartType, index) =>
            allamount[index].amount !== 0 ? (
              <p
                key={item.title}
                className="text-base leading-relaxed text-gray-500 dark:text-gray-400"
              >
                {item.title} X {allamount[index].amount} ={" "}
                {item.price * allamount[index].amount} SEK
              </p>
            ) : null
          )}
        </div>
      )}
    </>
  );
}
