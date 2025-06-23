"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context
type AmountType = {
  title: string;
  amount: number;
};

type CartContextType = {
  added: number;
  setAdded: React.Dispatch<React.SetStateAction<number>>;
  allamount: AmountType[];
  setAllAmounts: React.Dispatch<React.SetStateAction<AmountType[]>>;
  incrementAmount: (index: number) => void;
  decrementAmount: (index: number) => void;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [added, setAdded] = useState<number>(0); // Initial value for your cart
  const [allamount, setAllAmounts] = useState<AmountType[]>([]); // Initialize as an empty array

  // Function to increment amount for a specific index
  const incrementAmount = (index: number) => {
    setAllAmounts((prev) => {
      return prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, amount: item.amount + 1 }; // Increment the amount for that item
        }
        return item; // Return the unchanged item for all others
      });
    });
  };

  // Function to decrement amount for a specific index
  const decrementAmount = (index: number) => {
    setAllAmounts((prev) => {
      return prev.map((item, idx) => {
        if (idx === index) {
          const newAmount = item.amount > 0 ? item.amount - 1 : 0; // Prevent negative amounts
          return { ...item, amount: newAmount }; // Decrement the amount for that item
        }
        return item; // Return the unchanged item for all others
      });
    });
  };

  return (
    <CartContext.Provider
      value={{
        added,
        setAdded,
        allamount,
        setAllAmounts,
        incrementAmount,
        decrementAmount,
      }}
    >
      {children}
      {/* Example usage of incrementAmount and decrementAmount */}
      {/* These buttons are just for demonstration; you can replace them with your actual component logic */}
    </CartContext.Provider>
  );
};

// Custom hook to use the context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
