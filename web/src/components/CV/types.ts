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
  bulletPoints: string[];
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
  bulletPoints: string[];
};

type Remarks = {
  remarks: string;
};

// ---------------------------------------------------------------------------
// V2 flexible-sections format
// ---------------------------------------------------------------------------

type SectionKey =
  | 'profile'
  | 'education'
  | 'experience'
  | 'projects'
  | 'awards'
  | 'additional'
  | 'skills'
  | 'remarks'
  | 'custom';

type SectionDataMap = {
  profile: Profile;
  education: Education;
  experience: Experience[];
  projects: Project[];
  awards: Award[];
  additional: AdditionalExperience[];
  skills: Skills;
  remarks: Remarks;
  custom: string[];
};

type Section<K extends SectionKey = SectionKey> = {
  id: string;
  name: string;
  sectionKey: K;
  position: number;
  isVisible: boolean;
  data: SectionDataMap[K];
};

type SectionedFormData = {
  sections: Section[];
};

// ---------------------------------------------------------------------------
// Form component prop types
// ---------------------------------------------------------------------------

type FormComponentProps<T> = {
  formValue: T;
  onChange: (newValue: T) => void;
};

type ProfileFormComponent = React.FC<FormComponentProps<Profile>>;
type EducationFormComponent = React.FC<FormComponentProps<Education>>;
type ExperienceFormComponent = React.FC<FormComponentProps<Experience[]>>;
type ProjectsFormComponent = React.FC<FormComponentProps<Project[]>>;
type AwardsFormComponent = React.FC<FormComponentProps<Award[]>>;
type AdditionalFormComponent = React.FC<
  FormComponentProps<AdditionalExperience[]>
>;
type SkillsFormComponent = React.FC<FormComponentProps<Skills>>;
type RemarksFormComponent = React.FC<FormComponentProps<Remarks>>;

export type {
  SectionedFormData,
  Section,
  SectionKey,
  SectionDataMap,
  Profile,
  Education,
  Experience,
  Project,
  Award,
  AdditionalExperience,
  Skills,
  Remarks,
  ProfileFormComponent,
  EducationFormComponent,
  ExperienceFormComponent,
  ProjectsFormComponent,
  AwardsFormComponent,
  AdditionalFormComponent,
  SkillsFormComponent,
  RemarksFormComponent,
};

