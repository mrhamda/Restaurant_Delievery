"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ContactComp() {
  let submitRef = useRef<HTMLDivElement | null>(null);

  let firstNameRef = useRef<HTMLInputElement | null>(null);
  let lastNameRef = useRef<HTMLInputElement | null>(null);
  let gmailRef = useRef<HTMLInputElement | null>(null);
  let adressRef = useRef<HTMLInputElement | null>(null);
  let messageRef = useRef<HTMLTextAreaElement | null>(null);
  let checkBoxRef = useRef<HTMLInputElement | null>(null);
  let gmailForm = useRef<HTMLInputElement | null>(null);

  let adressContainer = useRef<HTMLDivElement | null>(null);

  let errRef = useRef<HTMLDivElement | null>(null);

  let allInfo = [firstNameRef, lastNameRef, gmailRef, adressRef, messageRef];

  let [disabled, setDisabled] = useState(true);
  let [disabledAlert, setDisabledAlert] = useState(false);
  let [toggle, setToggled] = useState(false);

  const disabledClasses = ["opacity-55", "pointer-events-none"];

  const gmailPattern = /^[a-zA-Z0-9.]{6,30}@gmail\.com$/;
  checkBoxRef;

  useGSAP(() => {
    gsap.from(".up", {
      y: "-50%",
      duration: 1,
      opacity: 0,
      ease: "circ",
      scrollTrigger: {
        trigger: ".up", 
        start: "top 80%", 
        toggleActions: "play none none none", 
      },
    });

   
    
    gsap.from(".left", {
      opacity: 0,
      x: "-10%",
      duration: 1,
      scrollTrigger: {
        trigger: ".left", 
        start: "top 80%", 
        toggleActions: "play none none none", 
      },
    });

    gsap.from(".fadeIn", {
      opacity: 0,
      y: "-10%",
      duration: 1,
      scrollTrigger: {
        trigger: ".left",
        start: "top 80%",
        toggleActions: "play none none none", 
      },
    });

    gsap.from(".down", {
      opacity: 0,
      y: "26%",
      duration: 1,
      scrollTrigger: {
        trigger: ".down", 
        start: "top 80%", 
        toggleActions: "play none none none",
      },
    });
  });

  useEffect(() => {
    const handleChangeMap = new Map();
    allInfo.forEach((element) => {
      const inputElement = element.current;
      if (inputElement) {
        const storedValue = localStorage.getItem(inputElement.id);
        if (storedValue) {
          inputElement.value = storedValue; 
        }
      }
    });

    const handleChange = () => {
      const errors = new Set();

      allInfo.forEach((element) => {
        const inputElement = element.current;

        if (inputElement) {
          localStorage.setItem(inputElement.id, inputElement.value);

          if (inputElement.value.trim() === "") {
            errors.add("Fill the empty inputs");
          }

          if (
            inputElement === gmailRef.current &&
            !gmailPattern.test(inputElement.value)
          ) {
            errors.add("Invalid Gmail");
          }
        }
      });

      const errorsArray = Array.from(errors);

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

    allInfo.forEach((element) => {
      const inputElement = element.current;
      if (inputElement) {
        inputElement.addEventListener("input", handleChange); 
        handleChangeMap.set(inputElement, handleChange); 
      }
    });

    const currentCheckbox = checkBoxRef.current;
    const handleToggle = () => {
      setToggled((prevToggled) => {
        const newToggled = !prevToggled;
        if (newToggled) {
          disabledClasses.forEach((_class) => {
            adressContainer.current?.classList.remove(_class);
          });
        } else {
          disabledClasses.forEach((_class) => {
            adressContainer.current?.classList.add(_class);
          });
        }
        console.log(toggle);

        return newToggled;
      });
    };

    currentCheckbox?.addEventListener("change", handleToggle);

    return () => {
      handleChangeMap.forEach((handleChange, inputElement) => {
        inputElement.removeEventListener("input", handleChange);
      });

      currentCheckbox?.removeEventListener("change", handleToggle);
    };
  }, [toggle]);

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
        submitRef.current?.classList.add(_class);
      });
    } else if (!disabled) {
      disabledClasses.forEach((_class) => {
        submitRef.current?.classList.remove(_class);
      });
    }
  }, [disabled]);

  useEffect(() => {
    function handleSubmit() {
      disabledClasses.forEach(async (_class) => {
        gmailForm.current?.classList.add(_class);
        submitRef.current!.textContent = "Sent";
        let x = "User doesnt have a problem with the order";

        if (checkBoxRef.current?.checked) {
          x = adressRef.current!.value;
        }

        try {
          const to = gmailRef.current?.value;

          const msg = `
            <div style="padding: 24px; max-width: 400px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <h2 style="font-size: 1.5rem; font-weight: bold; color: #4A5568; margin-bottom: 16px;">Message Summary</h2>
              <div style="color: #4A5568;">
                <p><strong>User:</strong> ${
                  firstNameRef.current?.value + " " + lastNameRef.current?.value
                }</p>
                <p><strong>Gmail:</strong> ${gmailRef.current?.value}</p>
                <p><strong>Address:</strong> ${x}</p>
                <div style="margin-top: 16px; padding: 16px; background-color: #EDF2F7; border-radius: 8px; border: 1px solid #E2E8F0;">
                  <p style="font-weight: bold; color: #2D3748;">Message:</p>
                  <p style="font-style: italic; color: #4A5568;">${
                    messageRef.current?.value
                  }</p>
                </div>
              </div>
            </div>
          `;

          const subject = `The customer ${firstNameRef.current?.value} ${lastNameRef.current?.value} has sent a messag`;

          const response = await fetch("/api/sendGmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: to,
              text: msg,
              subject: subject,
            }),
          });

          if (!response.ok) {
            throw new Error(
              "Network response was not ok" + response.statusText
            );
          }

          const result = await response.json(); 
          console.log("Email sent:", result);
        } catch (err) {
          console.error("Error sending email:", err);
          submitRef.current!.textContent = "Error has occured try again later";
        }
      });
    }
    submitRef.current?.addEventListener("click", handleSubmit);

    return () => {
      submitRef.current?.removeEventListener("click", handleSubmit);
    };
  }, []);

  useEffect(() => {
    if (submitRef.current) {
      submitRef.current.style.display = "block";
    }
  });
  return (
    <>
      <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 up">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Want to contact us?
        </h5>
        <span className="text-gray-900 dark:text-white">
          In this page you can contact us if you want. Through
          <span> </span>
          <a className="text-blue-500 hover:text-blue-700" href={"#gmail"}>
            Gmail
          </a>
          <span> </span>
          Or
          <span> </span>
          <a
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => {
              var win = window.open(
                `https://api.whatsapp.com/send?phone=+${process.env.NEXT_PUBLIC_PHNUM}&text=WriteYouMessage`,
                "_blank"
              );

              win!.focus();
            }}
          >
            Whatsapp
          </a>{" "}
          feel free to!
        </span>
      </div>
      <div 
        id="gmail"
        ref={gmailForm}
        className="  block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 mx-auto mb-5 left"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Ask us
          </h1>
          <div className="mb-6">
            <div className="flex items-center"></div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2 fadeIn">
              Required information
            </h2>
            <div className="mt-5 mb-5">
              <input
                id="link-checkbox"
                type="checkbox"
                value=""
                ref={checkBoxRef}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="link-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 "
              >
                This message is concerning my order
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 fadeIn">
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
            <div className="mt-4 fadeIn" ref={adressContainer}>
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
            <div className="mt-4 fadeIn">
              <label
                htmlFor="message"
                className="block text-gray-700 dark:text-white mb-1"
              >
                Message
              </label>
              <textarea
                rows={5}
                ref={messageRef}
                id="message"
                className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-none"
              />
            </div>
            <div className="mt-4 fadeIn">
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
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium "
            role="alert"
            ref={errRef}
          >
            Fill the empty inputs, Gmail Invalid
          </div>

          <div className="w-full flex justify-center">
            <div ref={submitRef} className=" pointer-events-none opacity-55">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 mb-5 down">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white fadeIn">
          Information
        </h5>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">Phone Number</td>
                <td className="px-6 py-4">+{process.env.NEXT_PUBLIC_PHNUM}</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4">Location</td>
                <td className="px-6 py-4">{process.env.NEXT_PUBLIC_LOC}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-center">
            <span className="text-gray-900 dark:text-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130006.68406271168!2d13.363811621289972!3d59.39379887662797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465cb130c39c5a51%3A0xff693f3e7649d52f!2sKronoparkens%20Pizzeria!5e0!3m2!1sen!2sse!4v1730306952081!5m2!1sen!2sse"
                width="600"
                height="450"
                loading="lazy"
              ></iframe>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
