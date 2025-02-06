import './Form.css';
import { Button } from '../Buttons/Buttons';
import Buttons from '../Buttons/Buttons';
import MultipleInputAndParent from './components/MultipleInputAndParent';
import MultipleInput from './components/MultipleInput';

export function ProfileForm({ formValue, onChange }) {
  const labels = {
    name: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    github: 'Link to Github',
    linkedin: 'Link to LinkedIn',
  };

  const placeholders = {
    name: 'Vincent Tanuwidjaja',
    email: 'vincent@gmail.com',
    phoneNumber: '(60) 11 9987 2635',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  };
  return (
    <div className='form'>
      <h2>Your Personal Info</h2>
      <hr />
      {Object.keys(formValue).map((label) => (
        <div key={label} className='input'>
          <label htmlFor={label} placeholder={placeholders[label]}>
            {labels[label]}
          </label>
          <input
            type='text'
            name={label}
            value={formValue[label]}
            placeholder={placeholders[label]}
            onChange={(e) =>
              onChange({ ...formValue, [label]: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
}

export function EducationForm({ formValue, onChange }) {
  const labels = {
    schoolName: 'School Name',
    fromDate: 'Date (from)',
    toDate: 'Date (to)',
    titleOfStudy: 'Title of Study',
    gpa: 'GPA',
    relevantCoursework: 'Relevant Coursework',
  };

  const placeholders = {
    schoolName: 'Monash University Malaysia',
    fromDate: '12/10/2022',
    toDate: '12/10/2024',
    titleOfStudy: "Bachelor's in Computer Science",
    gpa: '3.8/4',
    relevantCoursework: 'Relevant coursework',
  };

  return (
    <div className='form scroll'>
      <h2>Your Education Background</h2>
      <hr />
      {Object.keys(formValue).map((label) => (
        <div key={label} className='input'>
          <label htmlFor={label} placeholder={placeholders[label]}>
            {labels[label]}
          </label>
          {Array.isArray(formValue[label]) ? (
            <MultipleInput
              array={formValue[label]}
              onChange={onChange}
              formValueKey={label}
              placeholder={placeholders[label]}
              formValue={formValue}
            />
          ) : (
            <input
              type='text'
              name={label}
              value={formValue[label]}
              placeholder={placeholders[label]}
              onChange={(e) =>
                onChange({ ...formValue, [label]: e.target.value })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ExperienceForm({ formValue, onChange }) {
  const labels = {
    companyName: 'Company Name',
    positionTitle: 'Position Title',
    responsibilities: 'Responsibilities',
    dateFrom: 'Date (from)',
    dateUntil: 'Date (until)',
  };

  const placeholders = {
    companyName: 'MHUB Malaysia',
    positionTitle: 'Web Dev Intern',
    responsibilities: ['Writing new React components'],
    dateFrom: '15/11/2023',
    dateUntil: '23/02/2024',
  };

  function addJob() {
    const newFormValue = [...formValue];
    newFormValue.push({
      jobId: newFormValue.length + 1,
      companyName: '',
      positionTitle: '',
      responsibilities: [''],
      dateFrom: '',
      dateUntil: '',
    });
    onChange(newFormValue);
  }

  function removeJob() {
    const newFormValue = [...formValue];
    newFormValue.pop();
    onChange(newFormValue);
  }

  return (
    <div className='form scroll'>
      <h2>Your Work Experience</h2>
      <hr />
      {formValue.map((job, i1) => {
        return (
          <div key={i1} className='job-form'>
            {Object.keys(job).map((label) => {
              if (label === 'jobId') {
                return null;
              } else if (label === 'responsibilities') {
                return (
                  <div key={label} className='input'>
                    <label htmlFor={label} placeholder={placeholders[label]}>
                      {labels[label]}
                    </label>
                    <MultipleInputAndParent
                      array={job.responsibilities}
                      onChange={onChange}
                      placeholder={placeholders[label]}
                      formValueKey={label}
                      formValue={formValue}
                      i1={i1}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={label} className='input'>
                    <label htmlFor={label} placeholder={placeholders[label]}>
                      {labels[label]}
                    </label>
                    <input
                      type='text'
                      name={label}
                      value={job[label]}
                      placeholder={placeholders[label]}
                      onChange={(e) => {
                        const updatedFormValue = formValue.map((job, index) => {
                          if (index === i1) {
                            return { ...job, [label]: e.target.value };
                          }
                          return job;
                        });
                        onChange(updatedFormValue);
                      }}
                    />
                  </div>
                );
              }
            })}
            {i1 !== formValue.length - 1 && <hr className='job-hr' />}
          </div>
        );
      })}
      <Buttons>
        <Button text='Add' onClick={() => addJob()} />
        <Button
          text='Remove'
          disabled={formValue.length > 1 ? false : true}
          onClick={() => removeJob()}
        />
      </Buttons>
    </div>
  );
}

export function ProjectsForm({ formValue, onChange }) {
  const labels = {
    projectTitle: 'Project Title',
    projectDescription: 'Project Description',
    projectTechStack: 'Tech stack',
  };

  const placeholders = {
    projectTitle: 'CV Builder',
    projectDescription: 'CV Builder description..',
    projectTechStack: 'React',
  };

  function addProject() {
    const newFormValue = [...formValue];
    newFormValue.push({
      projectId: newFormValue.length + 1,
      projectTitle: '',
      projectDescription: '',
      projectTechStack: [''],
    });
    onChange(newFormValue);
  }

  function removeProject() {
    const newFormValue = [...formValue];
    newFormValue.pop();
    onChange(newFormValue);
  }

  return (
    <div className='form scroll'>
      <h2>Your Projects</h2>
      <hr />
      {formValue.map((proj, i1) => {
        return (
          <div key={i1} className='job-form'>
            {Object.keys(proj).map((label) => {
              if (label === 'projectId') {
                return null;
              } else if (label === 'projectTechStack') {
                return (
                  <div key={label} className='input'>
                    <label htmlFor={label} placeholder={placeholders[label]}>
                      {labels[label]}
                    </label>
                    <MultipleInputAndParent
                      array={proj.projectTechStack}
                      onChange={onChange}
                      placeholder={placeholders[label]}
                      formValueKey={label}
                      formValue={formValue}
                      i1={i1}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={label} className='input'>
                    <label htmlFor={label} placeholder={placeholders[label]}>
                      {labels[label]}
                    </label>
                    <input
                      type='text'
                      name={label}
                      value={proj[label]}
                      placeholder={placeholders[label]}
                      onChange={(e) => {
                        const updatedFormValue = formValue.map(
                          (proj, index) => {
                            if (index === i1) {
                              return { ...proj, [label]: e.target.value };
                            }
                            return proj;
                          }
                        );
                        onChange(updatedFormValue);
                      }}
                    />
                  </div>
                );
              }
            })}
            {i1 !== formValue.length - 1 && <hr className='job-hr' />}
          </div>
        );
      })}
      <Buttons>
        <Button text='Add' onClick={() => addProject()} />
        <Button
          text='Remove'
          disabled={formValue.length > 1 ? false : true}
          onClick={() => removeProject()}
        />
      </Buttons>
    </div>
  );
}

export function AwardsForm({ formValue, onChange }) {
  const labels = {
    awardTitle: 'Award Title',
    awardIssuer: 'Issuer',
    awardDescription: 'Description',
    awardDate: 'Date',
  };

  const placeholders = {
    awardTitle: 'Award Title',
    awardIssuer: 'Monash University Malaysia',
    awardDescription: 'Some award..',
    awardDate: '2024',
  };

  function addAward() {
    const newFormValue = [...formValue];
    newFormValue.push({
      awardId: formValue.length + 1,
      awardTitle: '',
      awardIssuer: '',
      awardDescription: '',
      awardDate: '',
    });
    onChange(newFormValue);
  }

  function removeAward() {
    const newFormValue = [...formValue];
    newFormValue.pop();
    onChange(newFormValue);
  }

  return (
    <div className='form scroll'>
      <h2>Awards & Honours</h2>
      <hr />
      {formValue.map((award, i1) => (
        <div key={i1} className='job-form'>
          {Object.keys(award).map((label) => {
            console.log(award);
            return (
              label !== 'awardId' && (
                <div key={label} className='input'>
                  <label htmlFor={label} placeholder={placeholders[label]}>
                    {labels[label]}
                  </label>
                  <input
                    type='text'
                    name={label}
                    value={formValue[i1][label]}
                    placeholder={placeholders[label]}
                    onChange={(e) => {
                      const updatedFormValue = formValue.map(
                        (additional, i2) => {
                          if (i2 == i1) {
                            return { ...additional, [label]: e.target.value };
                          }
                          return additional;
                        }
                      );
                      onChange(updatedFormValue);
                    }}
                  />
                </div>
              )
            );
          })}
          {i1 !== formValue.length - 1 && <hr className='job-hr' />}
        </div>
      ))}
      <Buttons>
        <Button text='Add' onClick={() => addAward()} />
        <Button
          text='Remove'
          disabled={formValue.length > 1 ? false : true}
          onClick={() => removeAward()}
        />
      </Buttons>
    </div>
  );
}

export function AdditionalForm({ formValue, onChange }) {
  const labels = {
    additionalTitle: 'Experience Title',
    additionalDescription: 'Experience Description',
    additionalDate: 'Date',
  };

  const placeholders = {
    additionalTitle: 'Java Mentor',
    additionalDescription: 'Taught fundamentals of Java',
    additionalDate: '2021',
  };

  function addAdditional() {
    const newFormValue = [...formValue];
    newFormValue.push({
      additionalId: formValue.length + 1,
      additionalTitle: '',
      additionalDescription: '',
      additionalDate: '',
    });
    onChange(newFormValue);
  }

  function removeAdditional() {
    const newFormValue = [...formValue];
    newFormValue.pop();
    onChange(newFormValue);
  }

  return (
    <div className='form scroll'>
      <h2>Your Additional Experience</h2>
      <hr />
      {formValue.map((exp, i1) => (
        <div key={i1} className='job-form'>
          {Object.keys(exp).map(
            (label) =>
              label !== 'additionalId' && (
                <div key={label} className='input'>
                  <label htmlFor={label} placeholder={placeholders[label]}>
                    {labels[label]}
                  </label>
                  <input
                    type='text'
                    name={label}
                    value={formValue[i1][label]}
                    placeholder={placeholders[label]}
                    onChange={(e) => {
                      const updatedFormValue = formValue.map(
                        (additional, i2) => {
                          if (i2 == i1) {
                            return { ...additional, [label]: e.target.value };
                          }
                          return additional;
                        }
                      );
                      onChange(updatedFormValue);
                    }}
                  />
                </div>
              )
          )}
          {i1 !== formValue.length - 1 && <hr className='job-hr' />}
        </div>
      ))}
      <Buttons>
        <Button text='Add' onClick={() => addAdditional()} />
        <Button
          text='Remove'
          disabled={formValue.length > 1 ? false : true}
          onClick={() => removeAdditional()}
        />
      </Buttons>
    </div>
  );
}

export function SkillsForm({ formValue, onChange }) {
  const labels = {
    general: 'General Skills',
    databases: 'Databases',
    languages: 'Programming Languages',
    others: 'Others',
  };

  const placeholders = {
    general: 'GraphQL',
    databases: 'MongoDB',
    languages: 'Go',
    others: 'Linux',
  };

  return (
    <div className='form scroll'>
      <h2>Your Skills</h2>
      <hr />
      {Object.keys(formValue).map((label) => (
        <div key={label} className='input'>
          <label htmlFor={label} placeholder={placeholders[label]}>
            {labels[label]}
          </label>
          <MultipleInput
            array={formValue[label]}
            onChange={onChange}
            inputLabel={labels[label]}
            formValueKey={label}
            placeholder={placeholders[label]}
            formValue={formValue}
          />
        </div>
      ))}
    </div>
  );
}

export function RemarkForm({ formValue, onChange }) {
  const labels = {
    remarks: 'Notice period',
  };

  const placeholders = {
    remarks: 'Available from ..',
  };

  return (
    <div className='form'>
      <h2>Remarks</h2>
      <hr />
      {Object.keys(formValue).map((label) => (
        <div key={label} className='input'>
          <label htmlFor={label} placeholder={placeholders[label]}>
            {labels[label]}
          </label>
          <input
            type='text'
            name={label}
            value={formValue[label]}
            placeholder={placeholders[label]}
            onChange={(e) =>
              onChange({ ...formValue, [label]: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
}
