import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ErrorPage from "../components/common/ErrorPage";

const Error404 = () => {
  return (
    <ErrorPage
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke URL baru."
      icon={ExclamationTriangleIcon}
      iconColor="text-white"
      iconBgColor="bg-red-500"
    />
  );
};

export default Error404;
