import { getCarFilters } from "@/actions/car-listing";
import React, { Suspense } from "react";
import CarFilters from "./_components/car-filters";
import CarListing from "./_components/car-listing";
import CarListingsLoading from "./_components/car-listing-loading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cars | Vehiql",
  description: "Browse and search for your dream car",
};

const defaultFilters = {
  makes: [],
  bodyTypes: [],
  fuelTypes: [],
  transmissions: [],
  priceRange: { min: 0, max: 100000 },
};

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  const filters = filtersData?.data || defaultFilters;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 shrink-0">
          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
            <CarFilters filters={filters} />
          </Suspense>
        </div>

        <div className="flex-1">
          <Suspense fallback={<CarListingsLoading />}>
            <CarListing />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
