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
  created_at: string;
  updated_at: string;
}

export interface ResumePayload {
  template_name: string;
  title: string;
  data: string;
  file: string;
}

export interface UpdateResumeMetadataTitlePayload {
  title: string;
}

export const getResumeMetadatas = async (): Promise<
  ResumeMetadata[]
> => {
  try {
    const resp = await axios.get<{
      resumeMetadatas: ResumeMetadata[];
    }>(`${api}/resume_metadatas`, {
      withCredentials: true,
    });

    return resp.data.resumeMetadatas;
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
): Promise<AxiosResponse<any, any>> => {
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
    axios.patch(
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
