"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { UserInfoAdmin } from "@/app/components/UserInfoAdmin";

type Order = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string;
  items: { product: string; quantity: number }[];
};

export const AdminComp = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const userContainerRef = useRef<HTMLDivElement>(null);
  const checkPassword = () => {
    const password = prompt("What's the password?");
    if (password === process.env.NEXT_PUBLIC_PASSWORD_URL) {
      setIsAdmin(true);
      alert("Access granted!"); 
    } else {
      alert("Access denied!"); 
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Admin") !== "TRUE") {
      checkPassword();
    } else {
      setIsAdmin(true);
    }
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/data/getOrders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await response.json();
      setOrders(data); // Update orders state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();

      const intervalId = setInterval(() => {
        fetchOrders(); 
      }, 3000);

      return () => clearInterval(intervalId); 
    }
  }, [isAdmin]); 

  if (!isAdmin) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="relative" ref={userContainerRef}>
      <div className="fixed top-4 right-4 bg-white p-2 shadow-md rounded-lg">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon icon={faSquare} className="text-red-600" />
          <span className="text-red-600 ml-2">{orders.length}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-5 mt-20 mb-5">
        {orders.map((ord) => (
          <UserInfoAdmin
            fullName={`${ord.firstName} ${ord.lastName}`}
            key={ord.id}
            city={ord.city}
            adress={ord.address}
            gmail={ord.email}
            orderInfo={ord.items}
            ord={ord}
          />
        ))}
      </div>
    </div>
  );
};

