"use client";
import { Shopcart } from "@/app/components/Shopcart";
import { useEffect, useRef, useState } from "react";
import { shopCartType } from "@/app/components/Shopcart";
import { Modal } from "@/app/components/Modal";
import { useCart } from "@/app/context/CartContext";
import menuData from "@/app/menuData.json";

// Import your JSON data
export type AmountTypes = {
  title: string;
  amount: number;
};

export function ShopCartComp() {
 
  const {
    setAdded,
    incrementAmount,
    decrementAmount,
    allamount,
    setAllAmounts,
  } = useCart();
  const [filteredItems, setFilteredItems] = useState<shopCartType[]>([]);
  const myOrderRef = useRef<HTMLButtonElement>(null);
  function handleAdd(increment: boolean, index: number) {
    if (increment) {
      incrementAmount(index);

      setAdded((prev: number) => prev + 1);
    } else {
      decrementAmount(index);
      setAdded((prev: number) => prev - 1);
    }
  }

  const menu: shopCartType[] = menuData.map((item, index) => ({
    ...item,
    index: index, // Ensure index is set properly
    handleAdd: handleAdd, // Add the handleAdd function
  }));

  useEffect(() => {
    if (allamount.length === 0) {
      const newAmounts = menu.map((element) => ({
        title: element.title,
        amount: 0,
      }));

      setAllAmounts(newAmounts);
    }
  }, [allamount.length, menu]);

  function handleFiltering(_type: string) {
    const _filteredItems = menu.filter(
      (item) => item._type === _type || _type === "all"
    );

    if (_type === "myorders") {
      const array: shopCartType[] = allamount
        .map((amounts, index) => (amounts.amount > 0 ? menu[index] : null))
        .filter((item) => item !== null) as shopCartType[];

      setFilteredItems(array.length > 0 ? array : []);
    } else {
      setFilteredItems(_filteredItems);
    }
  }

  function getUniqueCategories(menu: { _type: string }[]): string[] {
    return menu.reduce((accumulator: string[], item) => {
      if (!accumulator.includes(item._type)) {
        accumulator.push(item._type);
      }
      return accumulator;
    }, []);
  }

  const categories = getUniqueCategories(menu);

  return (
    <>
      <div className="flex justify-center mt-20">
        <div className="grid w-full max-w-screen-lg grid-cols-4 gap-2 md:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFiltering(category)}
              className="flex items-center justify-center h-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200 ease-in-out  btnAnim"
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => handleFiltering("all")}
            className="flex items-center justify-center h-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200 ease-in-out btnAnim"
          >
            All
          </button>

          <button
            onClick={() => handleFiltering("myorders")}
            className="flex items-center justify-center h-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200 ease-in-out btnAnim"
            ref={myOrderRef}
          >
            My orders
          </button>
        </div>
      </div>

      <div className="grid gap-5 mt-5 grid-cols-2 md:grid-cols-3 mb-5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="flex flex-col h-full elements-anim" key={item.title}>
              <Shopcart {...item} />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full col-span-2 md:col-span-3">
            <div className="text-lg text-gray-900 dark:text-white font-extrabold py-5">
              EMPTY ORDER
            </div>
          </div>
        )}
      </div>

      <Modal amounts={allamount} items={menu} />
    </>
  );
}
