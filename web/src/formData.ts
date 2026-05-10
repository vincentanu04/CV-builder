import type { SectionedFormData } from './components/CV/types';

export const initialFormData = {
  profile: {
    name: '',
    email: '',
    phoneNumber: '',
    github: '',
    linkedin: '',
  },
  education: {
    schoolName: '',
    fromDate: '',
    toDate: '',
    titleOfStudy: '',
    gpa: '',
    relevantCoursework: [''],
    bulletPoints: [''],
  },
  experience: [
    {
      jobId: 1,
      companyName: '',
      positionTitle: '',
      responsibilities: [''],
      dateFrom: '',
      dateUntil: '',
    },
  ],
  projects: [
    {
      projectId: 1,
      projectTitle: '',
      projectDescription: '',
      projectTechStack: [''],
    },
  ],
  awards: [
    {
      awardId: 1,
      awardTitle: '',
      awardIssuer: '',
      awardDescription: '',
      awardDate: '',
    },
  ],
  additional: [
    {
      additionalId: 1,
      additionalTitle: '',
      additionalDescription: '',
      additionalDate: '',
    },
  ],
  skills: { general: [''], databases: [''], languages: [''], others: [''], bulletPoints: [''] },
  remarks: { remarks: '' },
};

export const exampleFormData = {
  profile: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1234567890',
    github: 'https://github.com/johndoe',
    linkedin: 'http://www.linkedin.com/in/johndoe',
  },
  education: {
    schoolName: 'Tech University',
    fromDate: '2020',
    toDate: '2024',
    titleOfStudy: "Bachelor's in Software Engineering",
    gpa: '3.8',
    relevantCoursework: [
      'Full-stack web development',
      'Database management systems',
      'Software design patterns',
      'Data structures and algorithms',
      'Mobile application development',
      'Cloud computing fundamentals',
    ],
  },
  experience: [
    {
      jobId: 1,
      companyName: 'TechCorp Inc.',
      positionTitle: 'Software Engineer Intern',
      responsibilities: [
        'Developed REST and GraphQL APIs with Node.js and TypeScript.',
        'Implemented authentication and authorization using JWT.',
        'Created reusable React components and pages based of Figma designs using TypeScript for type safety and MUI for styling with customized CSS.',
        'Wrote unit and integration tests using Jest and React Testing Library.',
        'Used Docker to containerize applications for deployment.',
        'Monitored logs and performance metrics using DataDog.',
      ],
      dateFrom: 'Jun 2023',
      dateUntil: 'Dec 2023',
    },
    {
      jobId: 2,
      companyName: 'StartupX',
      positionTitle: 'Frontend Developer Intern',
      responsibilities: [
        'Developed interactive UI components using React and Tailwind CSS.',
        'Integrated frontend with backend APIs using GraphQL, while working closely with backend devs.',
        'Debug and troubleshoot bugs reported by clients and internal teams.',
        'Researched and utilized npm packages to optimize project functionality.',
        'Followed Agile methodologies with Jira for sprint planning.',
      ],
      dateFrom: 'Jan 2022',
      dateUntil: 'May 2022',
    },
  ],
  projects: [
    {
      projectId: 1,
      projectTitle: 'Task Manager App',
      projectDescription:
        'A full-stack task management web app with user authentication, real-time updates, and drag-and-drop task organization.',
      projectTechStack: [
        'React',
        'TypeScript',
        'Node.js',
        'Express.js',
        'MongoDB',
        'JWT authentication',
      ],
    },
    {
      projectId: 2,
      projectTitle: 'Resume Builder',
      projectDescription:
        'A React-based application that allows users to create and customize their resumes with downloadable PDF support.',
      projectTechStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    },
  ],
  awards: [
    {
      awardId: 1,
      awardTitle: 'Hackathon Winner - 1st Place',
      awardIssuer: 'Tech University',
      awardDescription:
        'Won first place in a university hackathon by building an AI-powered chatbot for customer service automation.',
      awardDate: '2023',
    },
  ],
  additional: [
    {
      additionalId: 1,
      additionalTitle: 'Open Source Contributor',
      additionalDescription:
        'Contributed to open-source projects by fixing bugs and improving documentation.',
      additionalDate: '2023',
    },
  ],
  skills: {
    general: [
      'React',
      'Next.js',
      'GraphQL',
      'Redux',
      'TypeScript',
      'Node.js',
      'Express.js',
      'REST APIs',
      'Docker',
      'Postman',
    ],
    databases: ['MongoDB', 'PostgreSQL'],
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java'],
    others: ['Git', 'Agile', 'CI/CD', 'Cloud Deployment'],
    bulletPoints: [''],
  },
  remarks: {
    remarks: 'Available to work from June 27th, 2025.',
  },
};

// ---------------------------------------------------------------------------
// V2 initial / example data helpers
// ---------------------------------------------------------------------------

export function makeExampleSectionedData(): SectionedFormData {
  return {
    sections: [
      { id: 's_profile', name: 'Profile', sectionKey: 'profile', position: 0, isVisible: true, data: exampleFormData.profile },
      { id: 's_education', name: 'Education', sectionKey: 'education', position: 1, isVisible: true, data: exampleFormData.education },
      { id: 's_experience', name: 'Experience', sectionKey: 'experience', position: 2, isVisible: true, data: exampleFormData.experience },
      { id: 's_projects', name: 'Projects', sectionKey: 'projects', position: 3, isVisible: true, data: exampleFormData.projects },
      { id: 's_awards', name: 'Awards', sectionKey: 'awards', position: 4, isVisible: true, data: exampleFormData.awards },
      { id: 's_additional', name: 'Additional experience', sectionKey: 'additional', position: 5, isVisible: true, data: exampleFormData.additional },
      { id: 's_skills', name: 'Skills', sectionKey: 'skills', position: 6, isVisible: true, data: exampleFormData.skills },
      { id: 's_remarks', name: 'Remarks', sectionKey: 'remarks', position: 7, isVisible: true, data: exampleFormData.remarks },
    ],
  };
}

export function makeInitialSectionedData(): SectionedFormData {
  return {
    sections: [
      {
        id: 's_profile',
        name: 'Profile',
        sectionKey: 'profile',
        position: 0,
        isVisible: true,
        data: { name: '', email: '', phoneNumber: '', github: '', linkedin: '' },
      },
      {
        id: 's_education',
        name: 'Education',
        sectionKey: 'education',
        position: 1,
        isVisible: true,
        data: {
          schoolName: '',
          fromDate: '',
          toDate: '',
          titleOfStudy: '',
          gpa: '',
          relevantCoursework: [''],
          bulletPoints: [''],
        },
      },
      {
        id: 's_experience',
        name: 'Experience',
        sectionKey: 'experience',
        position: 2,
        isVisible: true,
        data: [
          {
            jobId: 1,
            companyName: '',
            positionTitle: '',
            responsibilities: [''],
            dateFrom: '',
            dateUntil: '',
          },
        ],
      },
      {
        id: 's_projects',
        name: 'Projects',
        sectionKey: 'projects',
        position: 3,
        isVisible: true,
        data: [
          {
            projectId: 1,
            projectTitle: '',
            projectDescription: '',
            projectTechStack: [''],
          },
        ],
      },
      {
        id: 's_awards',
        name: 'Awards',
        sectionKey: 'awards',
        position: 4,
        isVisible: true,
        data: [
          {
            awardId: 1,
            awardTitle: '',
            awardIssuer: '',
            awardDescription: '',
            awardDate: '',
          },
        ],
      },
      {
        id: 's_additional',
        name: 'Additional experience',
        sectionKey: 'additional',
        position: 5,
        isVisible: true,
        data: [
          {
            additionalId: 1,
            additionalTitle: '',
            additionalDescription: '',
            additionalDate: '',
          },
        ],
      },
      {
        id: 's_skills',
        name: 'Skills',
        sectionKey: 'skills',
        position: 6,
        isVisible: true,
        data: { general: [''], databases: [''], languages: [''], others: [''], bulletPoints: [''] },
      },
      {
        id: 's_remarks',
        name: 'Remarks',
        sectionKey: 'remarks',
        position: 7,
        isVisible: true,
        data: { remarks: '' },
      },
    ],
  };
}

