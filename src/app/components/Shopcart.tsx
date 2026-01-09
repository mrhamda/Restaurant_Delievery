"use client";
import { Url } from "next/dist/shared/lib/router/router";
import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { width } from "@fortawesome/free-regular-svg-icons/faAddressBook";
import { useCart } from "../context/CartContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export type shopCartType = {
  [x: string]: any;
  url: Url;
  title: string;
  desc: string;
  price: number;
  _type: string;
  index: number;
  handleAdd: (increament: boolean, index: number) => void;
};
gsap.registerPlugin(ScrollTrigger);

export function Shopcart({
  url,
  title,
  desc,
  price,
  _type,
  index,
  handleAdd,
}: shopCartType): ReactElement {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const handleClick = (increment: boolean, index: number) => {
    handleAdd(increment, index);
    incrementCount();
  };

  let { allamount } = useCart();
  useEffect(() => {
    gsap.fromTo(
      ".btnAnim",
      { y: "-50%", opacity: 0 },
      { opacity: 1, duration: 0.35 }
    );

    gsap.fromTo(
      ".elements-anim",
      { backgroundColor: "red", opacity: 0, scale: 0.5 },  
      {
        scale: 1,
        backgroundColor: "",  
        opacity: 1,          
        duration: 0.35,       
        scrollTrigger: {
          trigger: ".elements-anim", 
          start: "top 80%",           
          toggleActions: "play none none none" 
        }
      }
    );
    
    
  }, []);
  return (
    <>
      <div className="flex flex-col h-full elements-anim">
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
          <div
            className="h-[200px] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          ></div>
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
            <div>
              <p className="font-bold text-gray-700 text-[22px] leading-7 mb-1">
                {title}
              </p>
              <div className="flex flex-row">
                <p className="text-[17px] font-bold text-[#0FB478]">
                  {price} SEK
                </p>
              </div>
              <p className="text-[#7C7C80] font-[15px] mt-6">{desc}</p>
            </div>
            <div className="mt-auto">
              {/* Placeholder for buttons to reserve space */}
              {allamount[index].amount > 0 ? (
                <div className="flex justify-center items-center mt-10 w-full px-4 py-3 font-medium tracking-wide text-center btn-custom">
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={() => handleClick(true, index)}
                  >
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      className="text-md md:text-lg"
                    />
                  </button>
                  <span className="text-4xl text-gray-900 block w-full px-4 py-3 font-medium tracking-wide text-center">
                    {allamount[index].amount}
                  </span>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={() => handleClick(false, index)}
                  >
                    <FontAwesomeIcon
                      icon={faSquareMinus}
                      className="text-md md:text-lg"
                    />
                  </button>
                </div>
              ) : (
                <div className="h-16"></div>
              )}
              {allamount[index].amount === 0 && (
                <a
                  onClick={() => handleClick(true, index)}
                  className="block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] rounded-[14px] hover:bg-[#FFC933DD] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80 cursor-pointer"
                >
                  Add to list
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
