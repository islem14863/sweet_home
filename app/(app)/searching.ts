import { useEffect, useState } from "react";
import fetchHomes from "../api/homes";
import filterHomes, { Filters } from "./filteredHomes";

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

export default function searching(search: string, filters: Filters) {
  const [homes, setHomes] = useState<Home[]>([]);
  const [filteredHomes, setFilteredHomes] = useState<Home[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(Infinity);
  const [error, setError] = useState(false);
  useEffect(() => {
    setHomes([]);
    setPage(1);
    setTotalPages(Infinity);
  }, [search, filters]);
  
  const loadHomes = async (targetPage = page) => {
    if (loading || targetPage > totalPages) return;
    setLoading(true);
    try {
      const data = await fetchHomes(targetPage, 5);
      const safeItems = Array.isArray(data.items) ? data.items : [];

      if (safeItems.length === 0) {
        setTotalPages(targetPage);
        return;
      }

      setHomes((prev) => {
        const combined = [...prev, ...safeItems];
        return Array.from(new Map(combined.map((h) => [h.id, h])).values());
      });

      setTotalPages(data.totalPages ?? totalPages);
      setPage(targetPage + 1);
    } catch (err) {
      console.error("Error fetching homes:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  setHomes([]);
  setPage(1);
  setTotalPages(Infinity);
  setError(false);
  loadHomes();
}, [search, filters]);

  useEffect(() => {
    const updatedFilters = { ...filters, search };
    setFilteredHomes(filterHomes(homes, updatedFilters));
  }, [homes, search, filters]);

  return {
    homes,
    filteredHomes,
    loading,
    error,
    loadHomes,
    page,
    totalPages,
  };
}