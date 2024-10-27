import './App.css';
import { useState } from 'react';
import Buttons from './components/Buttons/Buttons';
import { NavButton, Button } from './components/Buttons/Buttons';
import {
  ProfileForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  AdditionalForm,
  SkillsForm,
  RemarkForm,
  AwardsForm,
} from './components/Form/Form';
import CV from './components/CV/CV';
import { PDFDownloadLink, PDFViewer, StyleSheet } from '@react-pdf/renderer';

const initialFormData = {
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

const exampleFormData = {
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

function App() {
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [displayedData, setDisplayedData] = useState(initialFormData);

  const handleNavButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  const handleDownloadClick = () => {
    const blob = new Blob([JSON.stringify(displayedData)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = displayedData.profile.name
      ? `${displayedData.profile.name}_resume`
      : 'resume';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formsData = [
    { id: 0, formType: 'profile', text: 'Profile', formComponent: ProfileForm },
    {
      id: 1,
      formType: 'education',
      text: 'Education',
      formComponent: EducationForm,
    },
    {
      id: 2,
      formType: 'experience',
      text: 'Experience',
      formComponent: ExperienceForm,
    },
    {
      id: 3,
      formType: 'projects',
      text: 'Projects',
      formComponent: ProjectsForm,
    },
    {
      id: 4,
      formType: 'awards',
      text: 'Awards',
      formComponent: AwardsForm,
    },
    {
      id: 5,
      formType: 'additional',
      text: 'Additional experience',
      formComponent: AdditionalForm,
    },
    { id: 6, formType: 'skills', text: 'Skills', formComponent: SkillsForm },
    { id: 7, formType: 'remarks', text: 'Remarks', formComponent: RemarkForm },
  ];

  const SelectedFormComponent = formsData[selectedButtonId].formComponent;
  const formType = formsData[selectedButtonId].formType;

  const styles = StyleSheet.create({
    viewer: {
      flex: 'auto',
      border: 0,
      padding: 0,
      background:
        'linear-gradient(90deg, var(--background-clr), var(--secondary-clr) 75%)',
    },
  });

  console.log(displayedData);
  const CVComponent = (
    <CV
      profile={displayedData.profile}
      education={displayedData.education}
      experience={displayedData.experience}
      projects={displayedData.projects}
      awards={displayedData.awards}
      additional={displayedData.additional}
      skills={displayedData.skills}
      remarks={displayedData.remarks}
    />
  );

  return (
    <main>
      <div className='buttons-bar'>
        <Buttons>
          {formsData.map((button) => (
            <NavButton
              key={button.id}
              text={button.text}
              isSelected={selectedButtonId === button.id}
              onClick={() => handleNavButtonClick(button.id)}
            />
          ))}
        </Buttons>
        <Button text='Create' onClick={() => setDisplayedData(formData)} />
        <Buttons>
          <Button
            text='Example'
            onClick={() => {
              setFormData(exampleFormData);
              setDisplayedData(exampleFormData);
            }}
          />
          <Button
            text='Reset'
            onClick={() => {
              setFormData(initialFormData);
              setDisplayedData(initialFormData);
            }}
          />
        </Buttons>
      </div>
      <div className='form-container'>
        <SelectedFormComponent
          formValue={formData[formType]}
          onChange={(newFormValue) =>
            setFormData((prevFormValue) => ({
              ...prevFormValue,
              [formType]: newFormValue,
            }))
          }
        />
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', ...styles.viewer }}
      >
        <div className='toolbar'>
          <div className='downloadButtons'>
            <PDFDownloadLink
              document={CVComponent}
              fileName={
                displayedData.profile.name
                  ? `${displayedData.profile.name}_resume`
                  : 'resume'
              }
              style={{ textDecoration: 'none' }}
            >
              <button className='downloadButton'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='37.5'
                  height='37.5'
                  viewBox='0 0 20 20'
                  className='svg'
                >
                  <path d='M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z' />
                  <path d='M10 15l5-6h-4V1H9v8H5l5 6z' />
                </svg>
                <p>PDF</p>
              </button>
            </PDFDownloadLink>
            <button className='downloadButton' onClick={handleDownloadClick}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='37.5'
                height='37.5'
                viewBox='0 0 20 20'
                className='svg'
              >
                <path d='M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z' />
                <path d='M10 15l5-6h-4V1H9v8H5l5 6z' />
              </svg>
              <p>JSON</p>
            </button>
          </div>
          <button
            className='importJSON'
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';

              input.addEventListener('change', (e) => {
                const file = e.target.files[0];

                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const jsonString = event.target.result;
                    const json = JSON.parse(jsonString);

                    setFormData(json);
                    setDisplayedData(json);
                  };

                  reader.readAsText(file);
                }
              });

              input.click();
            }}
          >
            IMPORT FROM JSON
          </button>
        </div>
        <PDFViewer style={styles.viewer} showToolbar={false}>
          {CVComponent}
        </PDFViewer>
      </div>
    </main>
  );
}

export default App;
