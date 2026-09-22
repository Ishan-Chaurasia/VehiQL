import React from "react";
import CarsList from "./_components/car-list";

export const metadata = {
  title: "Admin - Cars",
  description: "Admin page for managing cars",
};

const CarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarsList />
    </div>
  );
};

export default CarsPage;
