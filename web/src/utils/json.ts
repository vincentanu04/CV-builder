import type { SectionedFormData } from '../components/CV/types';
import { makeInitialSectionedData } from '../formData';

/** Parse a resume data string and return SectionedFormData. */
export function parseResumeData(rawData: string): SectionedFormData {
  try {
    const parsed = JSON.parse(rawData);
    if (parsed && Array.isArray(parsed.sections)) {
      return parsed as SectionedFormData;
    }
  } catch {
    // fall through
  }
  return makeInitialSectionedData();
}

/** Serialize SectionedFormData to the string stored in the DB. */
export function serializeResumeData(data: SectionedFormData): string {
  return JSON.stringify(data);
}
