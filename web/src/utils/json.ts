import type { SectionedFormData, FormData } from '../components/CV/types';
import { makeInitialSectionedData } from '../formData';

// ---------------------------------------------------------------------------
// Legacy v1 helpers (ordered JSON array)
// ---------------------------------------------------------------------------

export function toOrderedJSON(obj: Record<string, unknown>): string {
  const orderedArray = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));
  return JSON.stringify(orderedArray);
}

export function fromOrderedJSON(jsonString: string): Record<string, unknown> {
  const parsedArray: { key: string; value: unknown }[] = JSON.parse(jsonString);
  return parsedArray.reduce(
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>
  );
}

// ---------------------------------------------------------------------------
// V2 helpers (flexible sections)
// ---------------------------------------------------------------------------

export function toSectionedJSON(data: SectionedFormData): string {
  return JSON.stringify(data);
}

/** Returns the parsed SectionedFormData if the string is v2, else null. */
export function parseSectionedJSON(jsonString: string): SectionedFormData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && parsed.schemaVersion === 2 && Array.isArray(parsed.sections)) {
      return parsed as SectionedFormData;
    }
    return null;
  } catch {
    return null;
  }
}

/** Convert a legacy v1 flat FormData to the v2 sectioned format. */
export function legacyToSectioned(legacy: FormData): SectionedFormData {
  const initial = makeInitialSectionedData();
  const sectionKeyMap: Record<string, unknown> = {
    profile: legacy.profile,
    education: legacy.education,
    experience: legacy.experience,
    projects: legacy.projects,
    awards: legacy.awards,
    additional: legacy.additional,
    skills: legacy.skills,
    remarks: legacy.remarks,
  };

  return {
    schemaVersion: 2,
    sections: initial.sections.map((s) => ({
      ...s,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (sectionKeyMap[s.sectionKey] ?? s.data) as any,
    })),
  };
}

/**
 * Parse any resume data string — handles both legacy v1 ordered JSON and v2
 * sectioned JSON — and always returns SectionedFormData.
 */
export function parseResumeData(rawData: string): SectionedFormData {
  // Try v2 first.
  const v2 = parseSectionedJSON(rawData);
  if (v2) return v2;

  // Fall back to v1 ordered JSON.
  try {
    const legacy = fromOrderedJSON(rawData) as FormData;
    return legacyToSectioned(legacy);
  } catch {
    return makeInitialSectionedData();
  }
}

/** Serialize SectionedFormData to the string stored in the DB. */
export function serializeResumeData(data: SectionedFormData): string {
  return toSectionedJSON(data);
}

