import { useQuery } from '@tanstack/react-query';
import { checkDealStatus } from '@/lib/estuary';

export function useDealStatus(cid: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['/api/deal', cid],
    queryFn: () => checkDealStatus(cid),
    enabled,
    refetchInterval: 60000, // Poll every 60 seconds
  });
}

export function useFileStats(walletAddress: string | null) {
  return useQuery({
    queryKey: ['/api/stats', walletAddress],
    enabled: !!walletAddress,
    refetchInterval: 30000, // Update stats every 30 seconds
  });
}

export function useUserFiles(walletAddress: string | null) {
  return useQuery({
    queryKey: ['/api/files', walletAddress],
    enabled: !!walletAddress,
    refetchInterval: 30000,
  });
}
