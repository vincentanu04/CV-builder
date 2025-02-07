type Profile = {
  name: string;
  email: string;
  phoneNumber: string;
  github?: string;
  linkedin?: string;
};

type Education = {
  schoolName: string;
  titleOfStudy: string;
  gpa?: string;
  fromDate?: string;
  toDate?: string;
  relevantCoursework: string[];
};

type Experience = {
  jobId: number;
  positionTitle: string;
  companyName: string;
  dateFrom: string;
  dateUntil?: string;
  responsibilities: string[];
};

type Project = {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  projectTechStack: string[];
};

type Award = {
  awardId: number;
  awardTitle: string;
  awardDate?: string;
  awardDescription?: string;
  awardIssuer?: string;
};

type AdditionalExperience = {
  additionalId: number;
  additionalTitle: string;
  additionalDescription: string;
  additionalDate: string;
};

type Skills = {
  general: string[];
  databases: string[];
  languages: string[];
  others: string[];
};

type Remarks = {
  remarks: string;
};

export type {
  Profile,
  Education,
  Experience,
  Project,
  Award,
  AdditionalExperience,
  Skills,
  Remarks,
};
