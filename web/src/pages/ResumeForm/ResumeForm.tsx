import './ResumeForm.css';
import { useEffect, useState } from 'react';
import Buttons from '@/components/Buttons/Buttons';
import { Button } from '@/components/ui/button';
import { NavButton } from '@/components/Buttons/Buttons';
import {
  ProfileForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  AdditionalForm,
  SkillsForm,
  RemarkForm,
  AwardsForm,
} from '@/components/Form/Form';
import CV from '@/components/CV/CV';
import { PDFDownloadLink, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { exampleFormData, initialFormData } from '@/formData';
import {
  AdditionalFormComponent,
  AwardsFormComponent,
  EducationFormComponent,
  ExperienceFormComponent,
  FormData,
  ProfileFormComponent,
  ProjectsFormComponent,
  RemarksFormComponent,
  SkillsFormComponent,
} from '@/components/CV/types';
import { createResume, getResume, updateResume } from '@/api/resume';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FORBIDDEN_MESSAGE } from '@/api/errors';
import { ConfirmBack } from '@/components/confirm-back';

interface ResumeFormProps {
  isEdit: boolean;
}

const ResumeForm = ({ isEdit }: ResumeFormProps) => {
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [displayedData, setDisplayedData] = useState<FormData>(initialFormData);
  const [isFileVisibleMobile, setIsFileVisibleMobile] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [lastSavedResume, setLastSavedResume] = useState<FormData | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  if (isEdit && (!id || isNaN(Number(id)))) {
    navigate('/home');
    return null;
  }

  const { data: originalResume, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResume(Number(id)),
    enabled: isEdit,
    retry: (_, error) => false,
  });

  const isResumeChanged =
    JSON.stringify(formData) !== JSON.stringify(lastSavedResume);

  useEffect(() => {
    if (error) {
      console.log(error);
      switch (error.message) {
        case FORBIDDEN_MESSAGE:
          console.log('FORBIDDEN');
          navigate('/');
          break;
        default:
          navigate('/home');
      }
    }

    if (originalResume) {
      setFormData(originalResume.data as FormData);
      setDisplayedData(originalResume.data as FormData);
      setLastSavedResume(originalResume.data as FormData);
    }
  }, [originalResume, error]);

  const handleNavButtonClick = (id: number) => {
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

  const handleShowExample = () => {
    setDisplayedData(exampleFormData);
  };

  const handleCreateOrSave = () => {
    if (isEdit && originalResume) {
      try {
        updateResume(Number(id), {
          template_name: originalResume.template_name,
          title: originalResume.title,
          data: formData,
          file: 'TEST',
        });
      } catch (error) {
        console.log(error);
        alert('Failed to save resume, please wait and try again.');
      }
    } else {
      try {
        createResume({
          template_name: 'TEST',
          title: 'TEST',
          data: formData,
          file: 'TEST',
        });
      } catch (error) {
        alert('Failed to save resume, please wait and try again.');
      }
    }
    setLastSavedResume(formData);
  };

  type FormDataItem = {
    id: number;
    formType: keyof FormData;
    text: string;
    formComponent:
      | ProfileFormComponent
      | EducationFormComponent
      | ExperienceFormComponent
      | ProjectsFormComponent
      | AwardsFormComponent
      | AdditionalFormComponent
      | SkillsFormComponent
      | RemarksFormComponent;
  };

  const formsData: FormDataItem[] = [
    {
      id: 0,
      formType: 'profile',
      text: 'Profile',
      formComponent: ProfileForm,
    },
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
        <div className='flex md:flex-col gap-4 items-center'>
          <ConfirmBack isResumeChanged={isResumeChanged} />
          <Button
            size={'sm'}
            className='py-2 px-6 flex-1'
            onClick={handleCreateOrSave}
            disabled={!isResumeChanged}
          >
            {isEdit ? 'Save' : 'Create'} Resume
          </Button>
        </div>
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
        <div className='hide-on-mobile flex flex-col gap-2 items-center'>
          <Button
            onClick={() => {
              setDisplayedData(formData);
              setIsExample(false);
            }}
            size={'lg'}
            className='mb-5 w-full'
          >
            Display
          </Button>
          <Button
            onClick={() => {
              const shouldShowExample = !isExample;
              if (shouldShowExample) {
                handleShowExample();
              } else {
                setDisplayedData(formData);
              }

              setIsExample(shouldShowExample);
            }}
            variant={'outline'}
          >
            {isExample ? 'Hide Example' : 'Show Example'}
          </Button>
        </div>
      </div>
      {/* only on mobile */}
      <button
        className='importJSON hide-on-desktop'
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';

          input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];

            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target) {
                  const jsonString = event.target.result as string;
                  const json = JSON.parse(jsonString);
                  setFormData(json);
                  setDisplayedData(json);
                }
              };

              reader.readAsText(file);
            }
          });

          input.click();
        }}
      >
        IMPORT FROM JSON
      </button>
      <div className='form-container'>
        <SelectedFormComponent
          formValue={formData[formType] as any}
          onChange={(newFormValue) =>
            setFormData((prevFormValue) => ({
              ...prevFormValue,
              [formType]: newFormValue,
            }))
          }
        />
      </div>
      <div className='action-buttons hide-on-desktop'>
        <Button
          onClick={() => {
            handleShowExample();
            if (window.innerWidth <= 786) {
              // For mobile, only show the file div when Create is pressed
              setIsFileVisibleMobile(true);
            }
          }}
        >
          Show Example
        </Button>
        <Button
          onClick={() => {
            setDisplayedData(formData);
            if (window.innerWidth <= 786) {
              // For mobile, only show the file div when Create is pressed
              setIsFileVisibleMobile(true);
            }
          }}
        >
          Display
        </Button>
      </div>
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
            className='importJSON hide-on-mobile'
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';

              input.addEventListener('change', (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];

                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target) {
                      const jsonString = event.target.result as string;
                      const json = JSON.parse(jsonString);
                      setFormData(json);
                      setDisplayedData(json);
                    }
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
          onClick={() => {
            setIsFileVisibleMobile(false);
          }}
        >
          Back
        </Button>
      </div>
    </main>
  );
};

export default ResumeForm;
