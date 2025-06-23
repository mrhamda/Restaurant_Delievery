import { AdminComp } from "@/app/components/AdminComp";
import { icon } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Admin",
  description: "Admin only",
  icons: {
    icon: "/Admin.ico"
  }
};
const Admin = () => {
  return (
    <>
      <AdminComp />
    </>
  );
};

export default Admin;
