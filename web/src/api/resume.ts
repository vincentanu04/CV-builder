import axios from 'axios';
import { FORBIDDEN, FORBIDDEN_MESSAGE } from './errors';

const api = 'http://localhost:8080/api';

export interface ResumeMetadata {
  id: number;
  title: string;
  resume_id: number;
  user_id: number;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: number;
  template_name: string;
  title: string;
  data: { [key: string]: any };
  created_at: string;
  updated_at: string;
}

export const getResumeMetadatas = async (): Promise<ResumeMetadata[]> => {
  try {
    const resp = await axios.get<{ resumeMetadatas: ResumeMetadata[] }>(
      `${api}/resume_metadatas`,
      {
        withCredentials: true,
      }
    );

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

export const getResume = async (resumeMetadataId: number): Promise<Resume> => {
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
