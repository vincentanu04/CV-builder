import './App.css'
import { useState } from 'react';
import Buttons from './components/Buttons/Buttons'
import { NavButton, Button } from './components/Buttons/Buttons'
import { ProfileForm, EducationForm, ExperienceForm } from './components/Form/Form';
import CV from './components/CV/CV';

function App() {
    const [selectedButtonId, setSelectedButtonId] = useState(0);
    const [formData, setFormData] = useState({
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
                positionTitle: '',
                responsibilities: [''],
                dateFrom: '',
                dateUntil: ''
            }
        ],
    });

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
                <Button text="Create" isSelected={false}/>
            </div>
            <SelectedFormComponent 
            formValue={formData[formType]} 
            onChange={newFormValue => setFormData(prevFormValue => (
                {   
                    ...prevFormValue,
                    [formType]: newFormValue
                }
            ))}/>
            <CV profile={formData.profile} education={formData.education} experience={formData.experience}/>
        </main>
    )
}

export default App