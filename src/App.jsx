import './App.css';
import { useState } from 'react';
import Buttons from './components/Buttons/Buttons';
import { NavButton, Button } from './components/Buttons/Buttons';
import {
  ProfileForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
} from './components/Form/Form';
import CV from './components/CV/CV';
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';

const initialFormData = {
  profile: {
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
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
};

const exampleFormData = {
  profile: {
    name: 'Vincent Tanuwidjaja',
    email: 'vincentanu04@gmail.com',
    phoneNumber: '(60) 11 2832 3824',
    location: 'Subang Jaya, Malaysia',
  },
  education: {
    schoolName: 'Monash University Malaysia',
    // schoolLocation: 'Subang Jaya, Malaysia',
    fromDate: '23/02/2022',
    toDate: '23/11/2024',
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
    {
      jobId: 2,
      companyName: 'Tiger Sugar Malaysia',
      location: 'Bandar Sunway, Malaysia',
      positionTitle: 'Barista',
      responsibilities: [
        'Created reusable React components and pages based of Figma designs using TypeScript for type safety and MUI for styling with customized CSS.',
        'Integrated the frontend with backend APIs using GraphQL, while working closely with backend developers.',
        'Debug and troubleshoot bugs reported by clients and internal teams.',
        'Researched and utilized npm packages to optimize project functionality & streamline development processes.',
        'Attained a comprehensive understanding of Git for version control.',
        'Actively participated in Agile methodologies and contributing to sprints, utilising Jira.',
      ],
      dateFrom: '15/11/2022',
      dateUntil: '23/02/2023',
    },
  ],
  projects: [
    {
      projectId: 1,
      projectTitle: 'CV (Resume) Builder',
      projectDescription:
        'A React web application for creating and printing personalized resumes as PDFs. In fact, it is what generated this resume.',
      projectTechStack: ['React', 'npm (react-pdf)', 'Vercel for deployment'],
    },
  ],
};

function App() {
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [displayedData, setDisplayedData] = useState(initialFormData);

  function handleNavButtonClick(id) {
    setSelectedButtonId(id);
  }

  const formsData = [
    { id: 0, text: 'Profile', formComponent: ProfileForm },
    { id: 1, text: 'Education', formComponent: EducationForm },
    { id: 2, text: 'Experience', formComponent: ExperienceForm },
    { id: 3, text: 'Projects', formComponent: ProjectsForm },
  ];

  const SelectedFormComponent = formsData[selectedButtonId].formComponent;
  const formType = formsData[selectedButtonId].text.toLowerCase();

  const styles = StyleSheet.create({
    viewer: {
      flex: 'auto',
      border: 0,
      padding: 0,
      background:
        'linear-gradient(90deg, var(--background-clr), var(--secondary-clr) 75%)',
    },
  });

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
            ></NavButton>
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
        />
      </PDFViewer>
    </main>
  );
}

export default App;
