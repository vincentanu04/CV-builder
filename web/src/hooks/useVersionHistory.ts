import { useGetResumeVersionsQuery } from '@/api/client';
import type { ResumeVersion } from '@/api/client';

export type { ResumeVersion };

export function useVersionHistory(resumeID: string) {
  const { data, isLoading, error, refetch } = useGetResumeVersionsQuery(
    { id: resumeID },
    { skip: !resumeID, refetchOnMountOrArgChange: true }
  );

  return {
    versions: data?.versions ?? [],
    isLoading,
    error,
    refetch,
  };
}

