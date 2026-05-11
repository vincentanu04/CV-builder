import { baseApi as api } from "../store/api";
export const addTagTypes = [] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getHealth: build.query<GetHealthApiResponse, GetHealthApiArg>({
        query: () => ({ url: `/health` }),
        providesTags: [],
      }),
      postAuthLogin: build.mutation<
        PostAuthLoginApiResponse,
        PostAuthLoginApiArg
      >({
        query: (queryArg) => ({
          url: `/login`,
          method: "POST",
          body: queryArg.authCredentials,
        }),
        invalidatesTags: [],
      }),
      postAuthRegister: build.mutation<
        PostAuthRegisterApiResponse,
        PostAuthRegisterApiArg
      >({
        query: (queryArg) => ({
          url: `/register`,
          method: "POST",
          body: queryArg.authCredentials,
        }),
        invalidatesTags: [],
      }),
      postAuthLogout: build.mutation<
        PostAuthLogoutApiResponse,
        PostAuthLogoutApiArg
      >({
        query: () => ({ url: `/logout`, method: "POST" }),
        invalidatesTags: [],
      }),
      getAuthMe: build.query<GetAuthMeApiResponse, GetAuthMeApiArg>({
        query: () => ({ url: `/me` }),
        providesTags: [],
      }),
      getResumes: build.query<GetResumesApiResponse, GetResumesApiArg>({
        query: () => ({ url: `/resumes` }),
        providesTags: [],
      }),
      postResume: build.mutation<PostResumeApiResponse, PostResumeApiArg>({
        query: (queryArg) => ({
          url: `/resumes`,
          method: "POST",
          body: queryArg.createResumeRequest,
        }),
        invalidatesTags: [],
      }),
      getResume: build.query<GetResumeApiResponse, GetResumeApiArg>({
        query: (queryArg) => ({ url: `/resumes/${queryArg.id}` }),
        providesTags: [],
      }),
      patchResume: build.mutation<PatchResumeApiResponse, PatchResumeApiArg>({
        query: (queryArg) => ({
          url: `/resumes/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.updateResumeRequest,
        }),
        invalidatesTags: [],
      }),
      deleteResume: build.mutation<DeleteResumeApiResponse, DeleteResumeApiArg>(
        {
          query: (queryArg) => ({
            url: `/resumes/${queryArg.id}`,
            method: "DELETE",
          }),
          invalidatesTags: [],
        },
      ),
      patchResumeTitle: build.mutation<
        PatchResumeTitleApiResponse,
        PatchResumeTitleApiArg
      >({
        query: (queryArg) => ({
          url: `/resumes/${queryArg.id}/title`,
          method: "PATCH",
          body: queryArg.updateResumeTitleRequest,
        }),
        invalidatesTags: [],
      }),
      getResumeVersions: build.query<
        GetResumeVersionsApiResponse,
        GetResumeVersionsApiArg
      >({
        query: (queryArg) => ({ url: `/resumes/${queryArg.id}/versions` }),
        providesTags: [],
      }),
      postResumeVersion: build.mutation<
        PostResumeVersionApiResponse,
        PostResumeVersionApiArg
      >({
        query: (queryArg) => ({
          url: `/resumes/${queryArg.id}/versions`,
          method: "POST",
          body: queryArg.createVersionRequest,
        }),
        invalidatesTags: [],
      }),
      getResumeVersion: build.query<
        GetResumeVersionApiResponse,
        GetResumeVersionApiArg
      >({
        query: (queryArg) => ({
          url: `/resumes/${queryArg.id}/versions/${queryArg.vid}`,
        }),
        providesTags: [],
      }),
      postResumeVersionRestore: build.mutation<
        PostResumeVersionRestoreApiResponse,
        PostResumeVersionRestoreApiArg
      >({
        query: (queryArg) => ({
          url: `/resumes/${queryArg.id}/versions/${queryArg.vid}/restore`,
          method: "POST",
        }),
        invalidatesTags: [],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type GetHealthApiResponse = unknown;
export type GetHealthApiArg = void;
export type PostAuthLoginApiResponse =
  /** status 200 Logged in successfully */ AuthUser;
export type PostAuthLoginApiArg = {
  authCredentials: AuthCredentials;
};
export type PostAuthRegisterApiResponse =
  /** status 200 Registered and logged in */ AuthUser;
export type PostAuthRegisterApiArg = {
  authCredentials: AuthCredentials;
};
export type PostAuthLogoutApiResponse = unknown;
export type PostAuthLogoutApiArg = void;
export type GetAuthMeApiResponse =
  /** status 200 Authenticated user */ AuthUser;
export type GetAuthMeApiArg = void;
export type GetResumesApiResponse =
  /** status 200 Resume list with plan-limit flag */ ResumeListResponse;
export type GetResumesApiArg = void;
export type PostResumeApiResponse = /** status 201 Resume created */ Resume;
export type PostResumeApiArg = {
  createResumeRequest: CreateResumeRequest;
};
export type GetResumeApiResponse = /** status 200 Resume */ Resume;
export type GetResumeApiArg = {
  id: string;
};
export type PatchResumeApiResponse = /** status 200 Updated resume */ Resume;
export type PatchResumeApiArg = {
  id: string;
  updateResumeRequest: UpdateResumeRequest;
};
export type DeleteResumeApiResponse = unknown;
export type DeleteResumeApiArg = {
  id: string;
};
export type PatchResumeTitleApiResponse =
  /** status 200 Updated resume */ Resume;
export type PatchResumeTitleApiArg = {
  id: string;
  updateResumeTitleRequest: UpdateResumeTitleRequest;
};
export type GetResumeVersionsApiResponse = /** status 200 Version list */ {
  versions: ResumeVersion[];
};
export type GetResumeVersionsApiArg = {
  id: string;
};
export type PostResumeVersionApiResponse =
  /** status 201 Version created */ ResumeVersion;
export type PostResumeVersionApiArg = {
  id: string;
  createVersionRequest: CreateVersionRequest;
};
export type GetResumeVersionApiResponse =
  /** status 200 Version snapshot */ ResumeVersion;
export type GetResumeVersionApiArg = {
  id: string;
  vid: string;
};
export type PostResumeVersionRestoreApiResponse =
  /** status 200 Resume after restore */ Resume;
export type PostResumeVersionRestoreApiArg = {
  id: string;
  vid: string;
};
export type AuthUser = {
  id: string;
  email: string;
  plan: "free" | "mid" | "pro";
};
export type ErrorResponse = {
  message: string;
};
export type AuthCredentials = {
  email: string;
  password: string;
};
export type Resume = {
  id: string;
  title: string;
  templateName: string;
  templateVersion: number;
  data: string;
  createdAt: string;
  updatedAt: string;
};
export type ResumeListResponse = {
  resumes: Resume[];
  limited: boolean;
};
export type CreateResumeRequest = {
  title: string;
  templateName: string;
  templateVersion?: number;
  data: string;
};
export type UpdateResumeRequest = {
  templateName: string;
  templateVersion?: number;
  data: string;
};
export type UpdateResumeTitleRequest = {
  title: string;
};
export type ResumeVersion = {
  id: string;
  resumeId: string;
  versionNumber: number;
  data: string;
  label?: string | null;
  isManual: boolean;
  createdAt: string;
};
export type CreateVersionRequest = {
  label: string;
};
export const {
  useGetHealthQuery,
  usePostAuthLoginMutation,
  usePostAuthRegisterMutation,
  usePostAuthLogoutMutation,
  useGetAuthMeQuery,
  useGetResumesQuery,
  usePostResumeMutation,
  useGetResumeQuery,
  usePatchResumeMutation,
  useDeleteResumeMutation,
  usePatchResumeTitleMutation,
  useGetResumeVersionsQuery,
  usePostResumeVersionMutation,
  useGetResumeVersionQuery,
  usePostResumeVersionRestoreMutation,
} = injectedRtkApi;
