// hooks/useProviders.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface ProviderFilterOptions {
  query?: string;
  location?: string;
  category?: string;
  rating?: number | null;
  sortBy?: string;
}

export function useProviders(initialFilters: ProviderFilterOptions = {}) {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProviderFilterOptions>(initialFilters);

  const fetchProvidersIndex = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.append("query", filters.query);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.category && filters.category !== "All Categories") {
        queryParams.append("category", filters.category);
      }
      if (filters.rating) queryParams.append("rating", String(filters.rating));
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);

      const response = await fetch(`/api/providers?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Server rejected index payload request query.");
      
      const dataset = await response.json();
      setProviders(dataset);
    } catch (err: any) {
      setError(err.message || "Failed extracting provider datasets from repository.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProvidersIndex();
  }, [fetchProvidersIndex]);

  const updateFilters = (newFilters: Partial<ProviderFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ sortBy: "nearest" });
  };

  return { providers, isLoading, error, filters, updateFilters, clearFilters, refetch: fetchProvidersIndex };
}