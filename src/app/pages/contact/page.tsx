import { ContactComp } from "@/app/components/ContactComp";

export const metadata = {
  title: "Contact Us",
  description: "Here you can send a mail or contact us directly via phone",
};
export default function page() {
  return <>
    <ContactComp />
  </>;
}
