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
  skills: { general: [''], databases: [''], languages: [''], others: [''] },
  remarks: { remarks: '' },
};

export const exampleFormData = {
  profile: {
    name: 'Vincent Tanuwidjaja',
    email: 'vincentanu04@gmail.com',
    phoneNumber: '(60)11-2660-3557',
    github: 'https://github.com/vincentanu04',
    linkedin: 'http://www.linkedin.com/in/vincent-tanuwidjaja',
  },
  education: {
    schoolName: 'Monash University Malaysia',
    fromDate: '2022',
    toDate: '2024',
    titleOfStudy: "Bachelor's in Computer Science",
    gpa: '',
    relevantCoursework: [
      'Collaborative engineering for web applications',
      'Databases using Oracle',
      'Object-oriented design & implementation, Mobile application development (Android)',
      'Data structures and algorithms',
      'Fundamentals of Java and Python',
      'Discrete and continuous mathematics',
    ],
  },
  experience: [
    {
      jobId: 1,
      companyName: 'Grab',
      positionTitle: 'Backend Engineer Intern',
      responsibilities: [
        "Implemented ReCAPTCHA as a challenge in Grab's login system to protect against fraudsters/bots.",
        "Created a technical design for the solution's implementation.",
        'Built gRPC and REST APIs using Go, Redis, and MySQL in a microservice architecture.',
        'Wrote Golang unit tests to ensure API reliability and code quality.',
        'Created and unit tested React components and pages with Redux, using Jest for JavaScript testing.',
        'Utilized Kibana for logging and DataDog for monitoring post-deployment.',
        "Identified vulnerabilities in Grab's products that could be mitigated using reCAPTCHA, enhancing login security against fraudulent access and bot activity.",
      ],
      dateFrom: 'Aug 2024',
      dateUntil: 'Dec 2024',
    },
    {
      jobId: 2,
      companyName: 'MHub Malaysia',
      positionTitle: 'Frontend Developer Intern',
      responsibilities: [
        'Created reusable React components and pages based of Figma designs using TypeScript for type safety and MUI for styling with customized CSS.',
        'Integrated frontend with backend APIs using GraphQL, while working closely with backend devs.',
        'Debug and troubleshoot bugs reported by clients and internal teams.',
        'Researched and utilized npm packages to optimize project functionality.',
        'Attained a comprehensive understanding of Git for version control.',
        'Actively participated in Agile methodologies and contributing to sprints, utilising Jira.',
      ],
      dateFrom: 'Nov 2023',
      dateUntil: 'Feb 2024',
    },
  ],
  projects: [
    {
      projectId: 1,
      projectTitle: "Where's Waldo",
      projectDescription:
        "A full-stack MERN web application offering Where's Waldo-style games, equipped with user accounts (authorization) and leaderboards.",
      projectTechStack: [
        'React',
        'TypeScript',
        'Tailwind CSS',
        'React Query',
        'Express.js',
        'JWT',
        'REST APIs',
        'MongoDB (Mongoose)',
      ],
    },
    {
      projectId: 2,
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application that lets users input their details for creating and printing personalized resumes as PDFs or JSON. In fact, it created this resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
  ],
  awards: [
    {
      awardId: 1,
      awardTitle: 'Monash Final Year Project Award - 3rd Place',
      awardIssuer: '',
      awardDescription:
        'Developed an Augmented Reality campus navigation mobile app, designed to assist new students and visitors in navigating the campus layout with ease. Built with Expo and React Native with TypeScript',
      awardDate: '2024',
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
  skills: {
    general: [
      'React',
      'React Native',
      'HTML',
      'CSS(SASS/LESS, Tailwind)',
      'Material UI',
      'GraphQL',
      'Redux',
      'gRPC',
      '                                            Express.js',
      'Node.js',
      'Postman',
      'Pug/Jade',
      'SQL',
      'Kibana',
      'Jest',
    ],
    databases: ['Oracle', 'MongoDB(Mongoose)'],
    languages: ['Go/Golang', 'JavaScript', 'TypeScript', 'Java', 'Python', 'C'],
    others: ['WSL2', 'Git', 'Agile', 'OOP'],
  },
  remarks: { remarks: '' },
};
