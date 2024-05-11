import './Form.css';
import { Button } from '../Buttons/Buttons';
import Buttons from '../Buttons/Buttons';

export function ProfileForm({ formValue, onChange }) {
  const labels = {
    name: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    location: 'Location',
    github: 'Link to Github',
    linkedin: 'Link to Linkedin',
  };

  const placeholders = {
    name: 'Vincent Tanuwidjaja',
    email: 'vincent@gmail.com',
    phoneNumber: '(60) 11 9987 2635',
    location: 'Subang Jaya, Malaysia',
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
    // schoolLocation: 'Location',
    fromDate: 'Date (from)',
    toDate: 'Date (to)',
    titleOfStudy: 'Title of Study',
    gpa: 'GPA',
    relevantCoursework: 'Relevant Coursework',
  };

  const placeholders = {
    schoolName: 'Monash University Malaysia',
    // schoolLocation: 'Subang Jaya, Malaysia',
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
            formValue[label].map((value, index) => (
              <input
                key={index}
                type='text'
                name={label}
                value={value}
                placeholder={`${placeholders[label]} ${index + 1}`}
                onChange={(e) =>
                  onChange({ ...formValue, [label]: e.target.value })
                }
              />
            ))
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
    location: 'Location',
  };

  const placeholders = {
    companyName: 'MHUB Malaysia',
    positionTitle: 'Web Dev Intern',
    responsibilities: ['Writing new React components'],
    dateFrom: '15/11/2023',
    dateUntil: '23/02/2024',
    location: 'Puchong, Malaysia',
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
            {Object.keys(job).map((label) => {
              if (label === 'jobId') {
                return null;
              } else if (label === 'responsibilities') {
                return (
                  <div key={label} className='input'>
                    <label htmlFor={label} placeholder={placeholders[label]}>
                      {labels[label]}
                    </label>
                    {job.responsibilities.map((responsibility, i2) => (
                      <input
                        key={i2}
                        type='text'
                        name={label}
                        value={responsibility}
                        placeholder={placeholders[label]}
                        onChange={(e) => {
                          const updatedFormValue = formValue.map(
                            (job, index1) => {
                              if (index1 === i1) {
                                return {
                                  ...job,
                                  responsibilities: job.responsibilities.map(
                                    (res, index2) => {
                                      if (index2 === i2) {
                                        return e.target.value;
                                      }
                                      return res;
                                    }
                                  ),
                                };
                              }
                              return job;
                            }
                          );
                          onChange(updatedFormValue);
                        }}
                      />
                    ))}
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
    formValue.push({
      projectId: formValue.length + 1,
      projectTitle: '',
      projectDescription: '',
      projectTechStack: [''],
    });
    onChange(formValue);
  }

  function removeProject() {
    formValue.pop();
    onChange(formValue);
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
                    {proj.projectTechStack.map((tech, i2) => (
                      <input
                        key={i2}
                        type='text'
                        name={label}
                        value={tech}
                        placeholder={placeholders[label]}
                        onChange={(e) => {
                          const updatedFormValue = formValue.map(
                            (proj, index1) => {
                              if (index1 === i1) {
                                return {
                                  ...proj,
                                  projectTechStack: proj.projectTechStack.map(
                                    (res, index2) => {
                                      if (index2 === i2) {
                                        return e.target.value;
                                      }
                                      return res;
                                    }
                                  ),
                                };
                              }
                              return proj;
                            }
                          );
                          onChange(updatedFormValue);
                        }}
                      />
                    ))}
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

  function addProject() {
    formValue.push({
      additionalId: formValue.length + 1,
      additionalTitle: '',
      additionalDescription: '',
      additionalDate: '',
    });
    onChange(formValue);
  }

  function removeProject() {
    formValue.pop();
    onChange(formValue);
  }

  return (
    <div className='form scroll'>
      <h2>Your Additional Experience</h2>
      <hr />
      {formValue.map((exp, i) => (
        <div key={i} className='job-form'>
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
                    value={formValue[i][label]}
                    placeholder={placeholders[label]}
                    onChange={(e) =>
                      onChange({ ...formValue, [label]: e.target.value })
                    }
                  />
                </div>
              )
          )}
          {i !== formValue.length - 1 && <hr className='job-hr' />}
        </div>
      ))}
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
      {Object.entries(formValue).map(([label, value]) => (
        <div key={label} className='input'>
          <label htmlFor={label} placeholder={placeholders[label]}>
            {labels[label]}
          </label>
          {value.map((skill, i) => (
            <input
              key={i}
              type='text'
              name={label}
              value={skill}
              placeholder={placeholders[label]}
              onChange={(e) =>
                onChange({ ...formValue, [label]: e.target.value })
              }
            />
          ))}
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
