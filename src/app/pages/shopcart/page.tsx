// File: Page.tsx

import { ShopCartComp } from "@/app/components/ShopCartComp";

export const metadata = {
  title: "Shopcart",
  description: "Here you can order and pay remotely",
};

export default function Page() {
  return (
    <>
      <ShopCartComp />;
    </>
  );
}
