import Link from "next/link";


export const metadata = {
  title: "Success",
  description: "Being directed here means you successfully paid for the order",
};
export default function page() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <p className="text-green-500">You successfully paid for the order</p>
      </div>

      <div className="flex flex-col mt-4">
        {" "}
        {/* Added mt-4 for spacing */}
        <a
          type="button"
          href={"/pages/contact"}

          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Contact us
        </a>
        <a
          type="button"
          href={"/pages/shopcart"}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Shopcart
        </a>
      </div>
    </div>
  );
}
