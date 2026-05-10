// Auto-generated RTK Query API client — matches server/api/openapi.yml.
// Regenerate with: npm run codegen (from web/)
import { baseApi as api } from '@/store/api';

export const addTagTypes = [
  'Health',
  'Auth',
  'Resumes',
  'ResumeVersions',
] as const;

// ── Schema types ──────────────────────────────────────────────────────────────

export interface ErrorResponse {
  message: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  plan: 'free' | 'mid' | 'pro';
}

export interface Resume {
  id: string;
  title: string;
  template_name: string;
  template_version: number;
  data: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeListResponse {
  resumes: Resume[];
  limited: boolean;
}

export interface CreateResumeRequest {
  title: string;
  template_name: string;
  template_version?: number;
  data?: string;
}

export interface UpdateResumeRequest {
  template_name?: string;
  template_version?: number;
  data?: string;
}

export interface UpdateResumeTitleRequest {
  title: string;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  data: string;
  label: string | null;
  is_manual: boolean;
  created_at: string;
}

export interface ResumeVersionsResponse {
  versions: ResumeVersion[];
}

export interface CreateVersionRequest {
  label: string;
}

// ── Injected endpoints ────────────────────────────────────────────────────────

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHealth: build.query<void, void>({
      query: () => ({ url: '/health', method: 'GET' }),
      providesTags: ['Health'],
    }),

    postAuthLogin: build.mutation<AuthUser, AuthCredentials>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth', 'Resumes', 'ResumeVersions'],
    }),

    postAuthRegister: build.mutation<AuthUser, AuthCredentials>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['Auth', 'Resumes', 'ResumeVersions'],
    }),

    postAuthLogout: build.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth', 'Resumes', 'ResumeVersions'],
    }),

    getAuthMe: build.query<AuthUser, void>({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      providesTags: ['Auth'],
    }),

    getResumes: build.query<ResumeListResponse, void>({
      query: () => ({ url: '/resumes', method: 'GET' }),
      providesTags: ['Resumes'],
    }),

    postResumes: build.mutation<Resume, CreateResumeRequest>({
      query: (body) => ({ url: '/resumes', method: 'POST', body }),
      invalidatesTags: ['Resumes'],
    }),

    getResume: build.query<Resume, { id: string }>({
      query: ({ id }) => ({ url: `/resumes/${id}`, method: 'GET' }),
      providesTags: (_result, _error, { id }) => [{ type: 'Resumes', id }],
    }),

    patchResume: build.mutation<Resume, { id: string } & UpdateResumeRequest>({
      query: ({ id, ...body }) => ({
        url: `/resumes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Resumes', id },
        'Resumes',
      ],
    }),

    deleteResume: build.mutation<void, { id: string }>({
      query: ({ id }) => ({ url: `/resumes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Resumes'],
    }),

    patchResumeTitle: build.mutation<
      Resume,
      { id: string } & UpdateResumeTitleRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/resumes/${id}/title`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Resumes', id },
        'Resumes',
      ],
    }),

    getResumeVersions: build.query<ResumeVersionsResponse, { id: string }>({
      query: ({ id }) => ({ url: `/resumes/${id}/versions`, method: 'GET' }),
      providesTags: (_result, _error, { id }) => [
        { type: 'ResumeVersions', id },
      ],
    }),

    postResumeVersion: build.mutation<
      ResumeVersion,
      { id: string } & CreateVersionRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/resumes/${id}/versions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ResumeVersions', id },
      ],
    }),

    getResumeVersion: build.query<
      ResumeVersion,
      { id: string; vid: string }
    >({
      query: ({ id, vid }) => ({
        url: `/resumes/${id}/versions/${vid}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { vid }) => [
        { type: 'ResumeVersions', id: vid },
      ],
    }),

    postResumeVersionRestore: build.mutation<
      Resume,
      { id: string; vid: string }
    >({
      query: ({ id, vid }) => ({
        url: `/resumes/${id}/versions/${vid}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Resumes', id },
        'Resumes',
        { type: 'ResumeVersions', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as api };

export const {
  useGetHealthQuery,
  usePostAuthLoginMutation,
  usePostAuthRegisterMutation,
  usePostAuthLogoutMutation,
  useGetAuthMeQuery,
  useGetResumesQuery,
  usePostResumesMutation,
  useGetResumeQuery,
  usePatchResumeMutation,
  useDeleteResumeMutation,
  usePatchResumeTitleMutation,
  useGetResumeVersionsQuery,
  usePostResumeVersionMutation,
  useGetResumeVersionQuery,
  usePostResumeVersionRestoreMutation,
} = injectedRtkApi;
