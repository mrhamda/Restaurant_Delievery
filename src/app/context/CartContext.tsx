"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [added, setAdded] = useState<number>(0); 
  const [allamount, setAllAmounts] = useState<AmountType[]>([]); 

  const incrementAmount = (index: number) => {
    setAllAmounts((prev) => {
      return prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, amount: item.amount + 1 }; 
        }
        return item; 
      });
    });
  };

  const decrementAmount = (index: number) => {
    setAllAmounts((prev) => {
      return prev.map((item, idx) => {
        if (idx === index) {
          const newAmount = item.amount > 0 ? item.amount - 1 : 0;
          return { ...item, amount: newAmount };
        }
        return item;
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
      
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
