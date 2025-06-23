"use client";

import { useEffect, useRef } from "react";

export function Footer() {
  let dateRef = useRef<HTMLSpanElement>(null);

  let date = new Date().getFullYear();
  useEffect(() => {
    if (dateRef.current != null) {
      dateRef.current.textContent = date.toString();
    }
  }, []);

  return (
    <>
      <footer className="w-full bg-white p-3 bottom-0">
        <p className="block mb-4 text-sm text-center text-slate-500 md:mb-0  border-slate-200 mt-4 pt-4 ">
          Copyright © <span ref={dateRef}>2023</span>&nbsp;
        </p>
      </footer>
    </>
  );
}
