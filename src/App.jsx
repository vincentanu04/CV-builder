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
} from './components/Form/Form';
import CV from './components/CV/CV';
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';

const initialFormData = {
  profile: {
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    github: '',
    linkedin: '',
  },
  education: {
    schoolName: '',
    // schoolLocation: '',
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
      location: '',
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
    phoneNumber: '(60) 11 2832 3824',
    location: 'Subang Jaya, Malaysia',
    github: 'https://github.com/vincentanu04',
    linkedin: 'http://www.linkedin.com/in/vincent-tanuwidjaja',
  },
  education: {
    schoolName: 'Monash University Malaysia',
    // schoolLocation: 'Subang Jaya, Malaysia',
    fromDate: '2022',
    toDate: '2024',
    titleOfStudy: "Bachelor's in Computer Science",
    gpa: '3.8/4',
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
      companyName: 'MHub Malaysia',
      location: 'Puchong, Malaysia',
      positionTitle: 'Frontend Developer Intern',
      responsibilities: [
        'Created reusable React components and pages based of Figma designs using TypeScript for type safety and MUI for styling with customized CSS.',
        'Integrated the frontend with backend APIs using GraphQL, while working closely with backend developers.',
        'Debug and troubleshoot bugs reported by clients and internal teams.',
        'Researched and utilized npm packages to optimize project functionality & streamline development processes.',
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
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application that lets users input their details for creating and printing personalized resumes as PDFs. In fact, this was used to generate this very resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
    {
      projectId: 2,
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application that lets users input their details for creating and printing personalized resumes as PDFs, including this very resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
    {
      projectId: 3,
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application that lets users input their details for creating and printing personalized resumes as PDFs, including this very resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
    {
      projectId: 4,
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application that lets users input their details for creating and printing personalized resumes as PDFs, including this very resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
  ],
  additional: [
    {
      additionalId: 1,
      additionalTitle: 'Python Workshop Mentor',
      additionalDescription:
        'Volunteered as a Python Workshop mentor in the Monash Robogals’ Python workshop. Taught the basics/foundations of python programming to new computer science as well as engineering students.',
      additionalDate: '2023',
    },
  ],
  skills: {
    general: [
      'React',
      'HTML',
      'CSS(SASS, Tailwind)',
      'Material UI',
      'GraphQL',
      'Express.js',
      'Node.js',
      'Fetch/REST APIs',
      'Pug/Jade',
    ],
    databases: ['Oracle', 'MongoDB(Mongoose)'],
    languages: ['JavaScript', 'TypeScript', 'Java', 'Python'],
    others: ['WSL2', 'Git', 'Agile', 'OOP'],
  },
  remarks: { remarks: 'Available from November 18, 2024 onwards' },
};

function App() {
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [displayedData, setDisplayedData] = useState(initialFormData);

  function handleNavButtonClick(id) {
    setSelectedButtonId(id);
  }

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
      formType: 'additional',
      text: 'Additional experience',
      formComponent: AdditionalForm,
    },
    { id: 5, formType: 'skills', text: 'Skills', formComponent: SkillsForm },
    { id: 6, formType: 'remarks', text: 'Remarks', formComponent: RemarkForm },
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

  console.log(SelectedFormComponent);
  console.log(formType);

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
              setFormData((prevData) => {
                const newData = exampleFormData;
                setDisplayedData(newData);
                return newData;
              });
            }}
          />
          <Button
            text='Reset'
            onClick={() => {
              setFormData((prevData) => {
                const newData = initialFormData;
                setDisplayedData(newData);
                return newData;
              });
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
      <PDFViewer style={styles.viewer}>
        <CV
          profile={displayedData.profile}
          education={displayedData.education}
          experience={displayedData.experience}
          projects={displayedData.projects}
          additional={displayedData.additional}
          skills={displayedData.skills}
          remarks={displayedData.remarks}
        />
      </PDFViewer>
    </main>
  );
}

export default App;
