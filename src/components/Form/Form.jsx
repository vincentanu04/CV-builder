import './Form.css'
import { Button } from '../Buttons/Buttons';
import Buttons from '../Buttons/Buttons';
import { Fragment } from 'react';

export function ProfileForm({ formValue, onChange }) {
    const labels = {
        name: 'Full Name',
        email: 'Email',
        phoneNumber: 'Phone Number',
        location: 'Location'
    };

    const placeholders = {
        name: 'Vincent Tanuwidjaja',
        email: 'vincent@gmail.com',
        phoneNumber: '(60) 11 9987 2635',
        location: 'Subang Jaya, Malaysia'
    };
    return (
        <div className='form'>
            <h2>Your Personal Info</h2>
            <hr />
            {Object.keys(formValue).map(label => (
                <div key={label} className="input">
                    <label htmlFor={label} placeholder={placeholders[label]}>{labels[label]}</label>
                    <input
                    type="text"
                    name={label}
                    value={formValue[label]} 
                    placeholder={placeholders[label]} 
                    onChange={e => onChange({ ...formValue, [label]: e.target.value })}
                    />  
                </div>   
            ))}
        </div>
    )
}

export function EducationForm({ formValue, onChange }) {
    const labels = {
        schoolName: 'School Name',
        schoolLocation: 'Location',
        titleOfStudy: 'Title of Study',
        gpa: 'GPA',
        fromDate: 'Date (from)',
        toDate: 'Date (to)'
    };

    const placeholders = {
        schoolName: 'Monash University Malaysia',
        schoolLocation: 'Subang Jaya, Malaysia',
        titleOfStudy: "Bachelor's in Computer Science",
        gpa: '3.8/4',
        fromDate: '12/10/2022',
        toDate: '12/10/2024'
    };

    return (
        <div className='form'>
            <h2>Your Education Background</h2>
            <hr />
            {Object.keys(formValue).map(label => (
                <div key={label} className="input">
                    <label htmlFor={label} placeholder={placeholders[label]}>{labels[label]}</label>
                    <input
                    type="text"
                    name={label}
                    value={formValue[label]} 
                    placeholder={placeholders[label]} 
                    onChange={e => onChange({ ...formValue, [label]: e.target.value})}
                    />  
                </div>   
            ))}
        </div>
    )
}

export function ExperienceForm( { formValue, onChange }) {
    const labels = {
        companyName: 'Company Name',
        positionTitle: 'Position Title',
        responsibilities: 'Responsibilities',
        dateFrom: 'Date (from)',
        dateUntil: 'Date (until)',
        location: 'Location'
    };

    const placeholders = {
        companyName: 'MHUB Malaysia',
        positionTitle: 'Web Dev Intern',
        responsibilities: ['Writing new React components'],
        dateFrom: '15/11/2023',
        dateUntil: '23/02/2024',
        location: 'Puchong, Malaysia'
    };

    function addJob() {
        formValue.push({
            jobId: formValue.length + 1,
            companyName: '',
            location: '',
            positionTitle: '',
            responsibilities: [''],
            dateFrom: '',
            dateUntil: '',
        });
        onChange(formValue);
    }

    function removeJob() {
        formValue.pop();
        onChange(formValue);
    }

    return (
        <div className='form scroll'>
            <h2>Your Work Experience</h2>
            <hr />
            {formValue.map((job, i1) => {
                return (
                    <div key={i1} className='job-form'>
                        {Object.keys(job).map(label => {
                            if (label === "jobId") {
                            return null;
                            } else if (label === "responsibilities") {
                            return (
                                <div key={label} className="input">
                                <label htmlFor={label} placeholder={placeholders[label]}>
                                    {labels[label]}
                                </label>
                                {job.responsibilities.map((responsibility, i2) => (
                                    <input
                                    key={i2}
                                    type="text"
                                    name={label}
                                    value={responsibility}
                                    placeholder={placeholders[label]}
                                    onChange={(e) => {
                                        const updatedFormValue = formValue.map((job, index1) => {
                                        if (index1 === i1) {
                                            return {
                                            ...job,
                                            responsibilities: job.responsibilities.map((res, index2) => {
                                                if (index2 === i2) {
                                                return e.target.value;
                                                }
                                                return res;
                                            }),
                                            };
                                        }
                                        return job;
                                        });
                                        onChange(updatedFormValue);
                                    }}
                                    />
                                ))}
                                </div>
                            );
                            } else {
                            return (
                                <div key={label} className="input">
                                <label htmlFor={label} placeholder={placeholders[label]}>
                                    {labels[label]}
                                </label>
                                <input
                                    type="text"
                                    name={label}
                                    value={job[label]}
                                    placeholder={placeholders[label]}
                                    onChange={(e => {
                                    const updatedFormValue = formValue.map((job, index) => {
                                        if (index === i1) {
                                        return { ...job, [label]: e.target.value };
                                        }
                                        return job;
                                    });
                                    onChange(updatedFormValue);
                                    })}
                                />
                                </div>
                            );
                            }
                        })}
                        {i1 !== formValue.length - 1 && <hr className='job-hr'/>}
                    </div>
                );
            })}
            <Buttons>
                <Button 
                text="Add"
                onClick={() => addJob()}
                />
                <Button 
                text="Remove" 
                disabled={formValue.length > 1 ? false : true}
                onClick={() => removeJob()}
                />
            </Buttons>
        </div>
    );
    
}