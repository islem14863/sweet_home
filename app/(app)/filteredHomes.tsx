import { Home } from "@/app/api/homes";

export type Filters = {
  search: string;
  selectedTypes: string[];
  selectedPriceRange: string | null;
  selectedBedrooms: number | null;
};

export default function filterHomes(homes: Home[], filters: Filters): Home[] {
  return homes.filter((home) => {
    const titleMatch = home.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const typeMatch =
      filters.selectedTypes.length === 0 ||
      home.propertyType
        .toLowerCase()
        .split(" ")
        .some((word) =>
          filters.selectedTypes.some((type) => word === type.toLowerCase())
        );

    const priceMatch = (() => {
      const price = Number(home.price.toString().replace(/\D/g, ""));
      switch (filters.selectedPriceRange) {
        case "under2000":
          return price < 2000;
        case "2000to3500":
          return price >= 2000 && price <= 3500;
        case "3500to5000":
          return price >= 3500 && price <= 5000;
        case "above5000":
          return price > 5000;
        case "none":
          return true;
        default:
          return true;
      }
    })();

    const bedroomsMatch = (() => {
      if (filters.selectedBedrooms === null) return true;
      if (filters.selectedBedrooms === 4) {
        return home.bedrooms >= 4;
      }
      return home.bedrooms === filters.selectedBedrooms;
    })();
    return titleMatch && typeMatch && priceMatch && bedroomsMatch;
  });
}