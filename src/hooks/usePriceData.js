import { useQuery } from "@tanstack/react-query";
import { fetchPriceData } from "../services/apiService";

function processPriceData(raw) {
  if (!raw || !Array.isArray(raw.data)) return [];

  const parsedArray = raw.data.map((item) => ({
    date: item.date,
    price: Number(item.price),
  }));

  parsedArray.sort((a, b) => new Date(a.date) - new Date(b.date));

  return parsedArray;
}

async function fetchAndProcessPriceData() {
  const raw = await fetchPriceData();
  return processPriceData(raw);
}

export function usePriceData() {
  return useQuery({
    queryKey: ["priceData"],
    queryFn: fetchAndProcessPriceData,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
