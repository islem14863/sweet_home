export const BaseUrl = "http://10.64.154.85:3000/api/v1";

export type Home = {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isAvailable: boolean;
  listingDate: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
};

type HomesResponse = {
  items: Home[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export default async function fetchHomes(
  page: number = 1,
  itemsPerPage: number = 3
): Promise<HomesResponse> {
  try {
    const res = await fetch(
      `${BaseUrl}/properties?page=${page}&items=${itemsPerPage}`
    );
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    } 
    return (await res.json()) as HomesResponse;
  } catch (error) {
    console.error("Fetch homes error:", error);
    return {
      items: [],
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
    };
  }
}