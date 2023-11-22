import './App.css'
import { useState } from 'react';
import Buttons from './components/Buttons/Buttons'
import { NavButton, Button } from './components/Buttons/Buttons'
import { ProfileForm, EducationForm, ExperienceForm } from './components/Form/Form';
import CV from './components/CV/CV';

const initialFormData = {
    profile: {
        name: '',
        email: '',
        phoneNumber: '',
        location: '',
    },
    education: {
        schoolName: '',
        schoolLocation: '',
        titleOfStudy: '',
        gpa: '',
        fromDate: '',
        toDate: '',
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
        }
    ],
};

const exampleFormData = {
    profile: {
        name: 'Vincent Tanuwidjaja',
        email: 'vincentanu@gmail.com',
        phoneNumber: '(60) 11 2832 3824',
        location: 'Subang Jaya, Malaysia',
    },
    education: {
        schoolName: 'Monash University Malaysia',
        schoolLocation: 'Subang Jaya, Malaysia',
        titleOfStudy: "Bachelor's in Computer Science",
        gpa: '3.8/4',
        fromDate: '23/02/2022',
        toDate: '23/11/2024',
    },
    experience: [
        {   
            jobId: 1,
            companyName: 'MHub Malaysia',
            location: 'Puchong, Malaysia',
            positionTitle: 'Web Developer Intern',
            responsibilities: ['Writing new React components'],
            dateFrom: '15/11/2023',
            dateUntil: '23/02/2024',
        }
    ],
}

function App() {
    const [selectedButtonId, setSelectedButtonId] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [displayedData, setDisplayedData] = useState(initialFormData)

    function handleNavButtonClick(id) {
        setSelectedButtonId(id);
    }

    const formsData = [
        { id: 0, text: "Profile", formComponent: ProfileForm},
        { id: 1, text: "Education" , formComponent: EducationForm},
        { id: 2, text: "Experience", formComponent: ExperienceForm}
    ];

    const SelectedFormComponent = formsData[selectedButtonId].formComponent;
    const formType = formsData[selectedButtonId].text.toLowerCase();

    return (
        <main>
            <div className='buttons-bar'>
                <Buttons>
                    {formsData.map(button => (
                        <NavButton 
                        key={button.id} 
                        text={button.text} 
                        isSelected={selectedButtonId === button.id} 
                        onClick={() => handleNavButtonClick(button.id)}>
                        </NavButton>
                    ))}
                </Buttons>
                <Button text="Create" onClick={() => setDisplayedData(formData)}/>
                <Buttons>
                    <Button 
                    text="Example" 
                    onClick={() => {
                        setFormData((prevData) => {
                            const newData = exampleFormData;
                            setDisplayedData(newData);
                            return newData;
                        });
                    }}/>
                    <Button 
                    text="Reset" 
                    onClick={() => {
                        setFormData((prevData) => {
                          const newData = initialFormData;
                          setDisplayedData(newData);
                          return newData;
                        });
                    }}/>
                </Buttons>
            </div>
            <SelectedFormComponent 
            formValue={formData[formType]} 
            onChange={newFormValue => setFormData(prevFormValue => (
                {   
                    ...prevFormValue,
                    [formType]: newFormValue
                }
            ))}/>
            <CV profile={displayedData.profile} education={displayedData.education} experience={displayedData.experience}/>
        </main>
    )
}

export default App