import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getResumeVersions, type ResumeVersion } from '@/api/resume';

export function useVersionHistory(resumeID: number) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ResumeVersion[]>({
    queryKey: ['resumeVersions', resumeID],
    queryFn: () => getResumeVersions(resumeID),
    enabled: resumeID > 0,
    staleTime: 30_000,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['resumeVersions', resumeID] });
  };

  return {
    versions: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
