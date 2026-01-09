"use client";

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";


// Import Flowbite without SSR
const Flowbite = dynamic(() => import("flowbite"), { ssr: false });

export function Navbar() {
 
  const [currentPageName, setCurrentPageName] = useState<string>("About");
  let x: SetStateAction<string>;
  const pathname = usePathname();
  const { added } = useCart();
  const clickedClassNames = [
    "text-indigo-400",
    "cursor-none",
    "pointer-events-none",
  ];

  useEffect(() => {
    const links = document.querySelectorAll("[data-link]");

    if (pathname === "/pages/shopcart") {
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
      x = "Shopcart";
      clickedClassNames.forEach((_className) => {
        links[0].classList.add(_className);
      });
    } else if (pathname === "/pages/contact") {
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
      x = "Contact";
      clickedClassNames.forEach((_className) => {
        links[2].classList.add(_className);
      });
    } else if (pathname === "/") {
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
      x = "About";
      clickedClassNames.forEach((_className) => {
        links[1].classList.add(_className);
      });
    } else if (pathname === "/pages/admin") {
      x = "Admin";
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
    } else if (pathname === "/pages/success") {
      x = "Success";
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
    } else if (pathname === "/pages/failure") {
      x = "Failure";
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
    } else {
      x = "About";
      clickedClassNames.forEach((_className, index) => {
        links[index].classList.remove(_className);
      });
      clickedClassNames.forEach((_className) => {
        links[0].classList.add(_className);
      });
    }

    setCurrentPageName(x);
  }, []);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const openSidebarButton = document.getElementById("open-sidebar");

    if (sidebar && openSidebarButton) {
      const handleSidebarToggle = (e: Event) => {
        e.stopPropagation();
        sidebar.classList.toggle("-translate-x-full");
      };

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          sidebar &&
          !sidebar.contains(target) &&
          openSidebarButton &&
          !openSidebarButton.contains(target)
        ) {
          sidebar.classList.add("-translate-x-full");
        }
      };

      openSidebarButton.addEventListener("click", handleSidebarToggle);
      document.addEventListener("click", handleClickOutside);

      return () => {
        openSidebarButton.removeEventListener("click", handleSidebarToggle);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, []);

  const handlePagination = (name: string, index: number) => {
    const sidebar = document.getElementById("sidebar")!;
    const links = document.querySelectorAll("[data-link]");

    links.forEach((link) => {
      clickedClassNames.forEach((_className) => {
        if (link.classList.contains(_className)) {
          link.classList.remove(_className);
        }
      });
    });

    clickedClassNames.forEach((_className) => {
      links[index].classList.add(_className);
    });

    setCurrentPageName(name);
    sidebar.classList.add("-translate-x-full");
  };

  useEffect(() => {
    const svgTrigger = document.querySelector(
      "[data-modal-toggle='shopModal']"
    );

    if (svgTrigger) {
      const initFlowbiteForSVG = async () => {
        const { initFlowbite } = await import("flowbite");
        if (initFlowbite) {
          initFlowbite();
        }
      };

      initFlowbiteForSVG();
    }
  }, [pathname]);
  function handleViewModal() {
    const modal = document.getElementById("shopModal");

    modal!.style.display = "flex";
  }

  return (
    <>
      <div
        style={{ zIndex: 2 }}
        className="absolute bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform -translate-x-full ease-in-out duration-300"
        id="sidebar"
      >
        <div className="p-4">
          <div className="flex justify-between items-center py-2">
            <h1 className="text-2xl font-semibold">{currentPageName}</h1>
          </div>

          <ul className="mt-4">
            <li className="mb-2">
              <a
                href="/pages/shopcart"
                className="block hover:text-indigo-400"
                data-link
                onClick={() => handlePagination("Shop", 0)}
              >
                Shop
              </a>
            </li>
            <li className="mb-2">
              <Link
                href="/"
                className="block hover:text-indigo-400"
                data-link
                onClick={() => handlePagination("About", 1)}
              >
                About
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/pages/contact"
                className="block hover:text-indigo-400 link"
                data-link
                onClick={() => handlePagination("Contact", 2)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-4 px-2">
              <h1 className="text-xl font-semibold">{currentPageName}</h1>

              <div className="flex items-center">
                <button
                  className="text-gray-500 hover:text-gray-600 mr-2"
                  id="open-sidebar"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>

                {pathname === "/pages/shopcart" && (
                  <div
                    className="relative cursor-pointer hover:opacity-90"
                    onClick={() => handleViewModal()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    {added > 0 && (
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs no-select">
                        {added}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
