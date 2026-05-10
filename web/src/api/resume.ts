import axios, { AxiosResponse } from 'axios';
import { FORBIDDEN, FORBIDDEN_MESSAGE } from './errors';
import { api } from './auth';

export interface ResumeMetadata {
  id: number;
  title: string;
  resume_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: number;
  template_name: string;
  title: string;
  data: string;
  template_version: number;
  created_at: string;
  updated_at: string;
}

export interface ResumePayload {
  template_name: string;
  title: string;
  data: string;
  file: string;
  template_version: number;
}

export interface UpdateResumeMetadataTitlePayload {
  title: string;
}

export interface ResumeVersion {
  id: number;
  resume_id: number;
  version_number: number;
  data: string; // included in both list and single-version responses
  label: string | null;
  is_manual: boolean;
  created_at: string;
}

export interface CreateNamedVersionPayload {
  label: string;
}

export interface getResumeMetadatasResponse {
  resumeMetadatas: ResumeMetadata[];
  limited: boolean;
}
export const getResumeMetadatas =
  async (): Promise<getResumeMetadatasResponse> => {
    try {
      const resp =
        await axios.get<getResumeMetadatasResponse>(
          `${api}/resume_metadatas`,
          {
            withCredentials: true,
          }
        );

      return resp.data;
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.status === FORBIDDEN) {
          throw new Error(FORBIDDEN_MESSAGE);
        }
      }

      throw new Error('Failed to fetch resume metadatas');
    }
  };

export const getResume = async (
  resumeMetadataId: number
): Promise<Resume> => {
  try {
    const response = await axios.get<{ resume: Resume }>(
      `${api}/resumes/${resumeMetadataId}`,
      { withCredentials: true }
    );
    return response.data.resume;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error('Failed to fetch resume');
  }
};

export const createResume = async (
  resumePayload: ResumePayload
): Promise<AxiosResponse<{ createdResumeID: number }>> => {
  try {
    return axios.post(`${api}/resumes`, resumePayload, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error('Failed to create resume');
  }
};

export const updateResume = async (
  resumeID: number,
  resumePayload: ResumePayload
) => {
  try {
    return await axios.patch(
      `${api}/resumes/${resumeID}`,
      resumePayload,
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error('Failed to update resume');
  }
};

export const deleteResume = async (resumeID: number) => {
  try {
    axios.delete(`${api}/resumes/${resumeID}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error('Failed to delete resume');
  }
};

export const updateResumeMetadataTitle = async (
  resumeMetadataID: number,
  payload: UpdateResumeMetadataTitlePayload
) => {
  try {
    axios.patch(
      `${api}/resume_metadatas/${resumeMetadataID}/title`,
      payload,
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error(
      'Failed to update resume metadata title'
    );
  }
};

// ---------------------------------------------------------------------------
// Version history
// ---------------------------------------------------------------------------

export const getResumeVersions = async (
  resumeID: number
): Promise<ResumeVersion[]> => {
  try {
    const resp = await axios.get<{ versions: ResumeVersion[] }>(
      `${api}/resumes/${resumeID}/versions`,
      { withCredentials: true }
    );
    return resp.data.versions ?? [];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch version history');
  }
};

export const getResumeVersion = async (
  resumeID: number,
  versionID: number
): Promise<ResumeVersion> => {
  try {
    const resp = await axios.get<{ version: ResumeVersion }>(
      `${api}/resumes/${resumeID}/versions/${versionID}`,
      { withCredentials: true }
    );
    return resp.data.version;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch version');
  }
};

export const createNamedVersion = async (
  resumeID: number,
  payload: CreateNamedVersionPayload
): Promise<ResumeVersion> => {
  try {
    const resp = await axios.post<{ version: ResumeVersion }>(
      `${api}/resumes/${resumeID}/versions`,
      payload,
      { withCredentials: true }
    );
    return resp.data.version;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create checkpoint');
  }
};

export const restoreResumeVersion = async (
  resumeID: number,
  versionID: number
): Promise<void> => {
  try {
    await axios.post(
      `${api}/resumes/${resumeID}/versions/${versionID}/restore`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to restore version');
  }
};
