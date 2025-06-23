"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function About() {
 
  gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin
  useGSAP(() => {
 
    gsap.from(".about-sec", {
      duration: 1,
      y: "-80%",
      opacity: 0,
      ease: "circ",
      scrollTrigger: {
        trigger: ".about-sec", // Element to watch for scroll position
        start: "top 80%", // Trigger when the top of .about-sec reaches 80% of the viewport height
        toggleActions: "play none none none", // Only play the animation on scroll into view
      },
    });

    gsap.from(".text-anim", {
      duration: 1,
      x: "-80%",
      opacity: 0,
      ease: "circ",
      scrollTrigger: {
        trigger: ".text-anim", // Element to watch for scroll position
        start: "top 80%", // Trigger when the top of .about-sec reaches 80% of the viewport height
        toggleActions: "play none none none", // Only play the animation on scroll into view
      },
    });

    gsap.from(".map-info-anim", {
      duration: 1,
      x: "50%",
      opacity: 0,
      ease: "circ",
      scrollTrigger: {
        trigger: ".map-info-anim", // Element to watch for scroll position
        start: "top 80%", // Trigger when the top of .about-sec reaches 80% of the viewport height
        toggleActions: "play none none none", // Only play the animation on scroll into view
      },
    });

    gsap.from(".vid", {
      duration: 1,
      y: "-50%",
      opacity: 0,
      ease: "circ",
      scrollTrigger: {
        trigger: ".vid", // Element to watch for scroll position
        start: "top 80%", // Trigger when the top of .about-sec reaches 80% of the viewport height
        toggleActions: "play none none none", // Only play the animation on scroll into view
      },
    });
  });
  return (
    <>
      <div>
        <div className="aspect-w-16 aspect-h-9 vid">
          <iframe
            className="w-full" // Ensure iframe takes full width and height
            height={500}
            src="https://www.youtube.com/embed/fZ3PqU2EoOM?si=d2-JmHB8vnZfDuBH&autoplay=1&mute=1&playlist=fZ3PqU2EoOM&loop=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay;"
            frameBorder="0" // Add this for better compliance with HTML5
            allowFullScreen // Enable full-screen mode
          ></iframe>
        </div>

        <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 about-sec">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            About our resturant
          </h5>
          <span className="text-gray-900 dark:text-white">
            Cleanliness is a top priority, ensuring a pleasant experience for
            our guests. Our dedicated team provides exceptional service, with
            knowledgeable staff ready to assist with menu recommendations. Our
            diverse menu features high-quality dishes made from fresh, locally
            sourced ingredients, catering to various dietary preferences. We
            focus on delivering great taste and value for your money, ensuring
            that every visit is memorable. We look forward to welcoming you and
            sharing our passion for good food and community! If you're
            interested feel free to visit our{" "}
            <a
              className="text-blue-500 hover:text-blue-700 "
              href={"/pages/shopcart"}
            >
              menu
            </a>
            . Need to{" "}
            <a
              className="text-blue-500 hover:text-blue-700 "
              href={"/pages/contact"}
            >
              contact
            </a>{" "}
            us feel free.
          </span>
        </div>

        <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 map-info-anim">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-anim" >
            Location
          </h5>
          <p className="flex justify-center">{process.env.NEXT_PUBLIC_LOC}</p>
          <div className="flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130006.68406271168!2d13.363811621289972!3d59.39379887662797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465cb130c39c5a51%3A0xff693f3e7649d52f!2sKronoparkens%20Pizzeria!5e0!3m2!1sen!2sse!4v1730306952081!5m2!1sen!2sse"
              width="600"
              height="450"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
