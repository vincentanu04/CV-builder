import './CV.css'

export default function CV({ profile, education, experience }) {
    const { name, email, phoneNumber, location } = profile;
    const { schoolName, schoolLocation, titleOfStudy, gpa, fromDate, toDate} = education;
    return (
        <div className="cv">
            <div className="paper">
                {name}
                {email}
                {phoneNumber}
                {location}
            </div>
        </div>
    )
}