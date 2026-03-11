import { useQuery } from "@tanstack/react-query";
import {
  fetchQueue,
  fetchQueueOutbound,
  fetchQueueScheduled,
} from "../services/apiService";

export function useQueueData() {
  return useQuery({
    queryKey: ["queueData"],
    queryFn: fetchQueue,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useQueueOutbound() {
  return useQuery({
    queryKey: ["queueOutbound"],
    queryFn: fetchQueueOutbound,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useQueueScheduled() {
  return useQuery({
    queryKey: ["queueScheduled"],
    queryFn: fetchQueueScheduled,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
