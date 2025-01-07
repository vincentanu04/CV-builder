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
import { exampleFormData, initialFormData } from './formData';

function App() {
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [displayedData, setDisplayedData] = useState(initialFormData);
  const [isFileVisibleMobile, setIsFileVisibleMobile] = useState(false);

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
        <Buttons className='form-buttons'>
          {formsData.map((button) => (
            <NavButton
              key={button.id}
              text={button.text}
              isSelected={selectedButtonId === button.id}
              onClick={() => handleNavButtonClick(button.id)}
            />
          ))}
        </Buttons>
        <Buttons className='action-buttons hide-on-mobile'>
          <Button
            text='Create'
            onClick={() => {
              setDisplayedData(formData);
            }}
          />
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
      <Buttons className='action-buttons hide-on-desktop'>
        <Button
          text='Example'
          onClick={() => {
            setFormData(exampleFormData);
            setDisplayedData(exampleFormData);
            if (window.innerWidth <= 500) {
              // For mobile, only show the file div when Create is pressed
              setIsFileVisibleMobile(true);
            }
          }}
        />
        <Button
          text='Create'
          onClick={() => {
            setDisplayedData(formData);
            if (window.innerWidth <= 500) {
              // For mobile, only show the file div when Create is pressed
              setIsFileVisibleMobile(true);
            }
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
      <div
        style={{ display: 'flex', flexDirection: 'column', ...styles.viewer }}
        className={`file ${isFileVisibleMobile ? 'show' : ''}`}
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
        <Button
          className='hide-on-desktop back-button'
          text='Back'
          onClick={() => {
            setIsFileVisibleMobile(false);
          }}
        />
      </div>
    </main>
  );
}

export default App;
