import './CV.css'

export default function CV({ profile, education, experience }) {
    const { name, email, phoneNumber, location } = profile;
    const { schoolName, schoolLocation, titleOfStudy, gpa, fromDate, toDate} = education;

    return (
        <div className="cv">
            <div className="paper">
                <div className="profile">
                    <h2>{name}</h2>
                    <div className="profile-subtitle">
                        <p>{location}</p>
                        <p>{email}</p>
                        <p>{phoneNumber}</p>
                    </div>
                </div>
                {Object.values(education).some(value => value !== '') && (
                    <div className="education">
                        <h3>Education</h3>
                        <hr />
                        <div className="subtitle">
                            <h3 className="subtitle-left">{schoolLocation}</h3>
                            <h3 className='subtitle-center'>{schoolName}</h3>
                            <h3 className='subtitle-right'>{fromDate} - {toDate}</h3>
                        </div>
                        <ul className="content">
                            {titleOfStudy !== '' && (
                                <li>
                                <p>- {titleOfStudy}</p>
                                </li>
                            )}
                            {gpa !== '' && (
                                <li>
                                    <p>- <b>GPA: </b>{gpa}</p>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                {Object.entries(experience[0]).some(([key, value]) => {
                    if (key === "jobId") return false
                    else if (key === "responsibilities") {
                        return value[0] !== '';
                    }
                    else return value !== '';
                }) && (
                    <div className="experience">
                        <h3>Work Experience</h3>
                        <hr />
                        {experience.map(job => {
                            return (
                                <>
                                    <div className="subtitle">
                                        <h3 className='subtitle-left'>{job.positionTitle}</h3>
                                        <h3 className='subtitle-center'>{job.companyName}</h3>
                                        <h3 className='subtitle-right'>{job.dateFrom} - {job.dateUntil}</h3>
                                    </div>
                                    <p>{job.location}</p>
                                    <ul className="content">
                                        {job.responsibilities.map(responsibility => responsibility !== '' && (
                                            <li key={responsibility}>
                                                <p>
                                                    - {responsibility}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}