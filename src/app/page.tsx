import { About } from "./components/About";
import Head from "next/head";

export const metadata = {
  title: "About Us",
  description: "You can read some basic information about the resturant",
};
export default function Home() {
  
  return (
    <>
     
      <About />
    </>
  );
}
