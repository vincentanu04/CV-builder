import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base RTK Query API — do NOT add endpoints here.
// All endpoints are injected by the auto-generated src/api/client.ts.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'Resumes', 'ResumeVersions', 'Health'] as const,
  endpoints: () => ({}),
});
