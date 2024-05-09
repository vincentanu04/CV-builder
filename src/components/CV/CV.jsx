import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import './CV.css';
import LibreBaskervilleRegular from '/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf';
import LibreBaskervilleBold from '/fonts/Libre_Baskerville/LibreBaskerville-Bold.ttf';
import { Item } from './components/List';
import { ItemWithTitle } from './components/ItemWithTitle';

const styles = StyleSheet.create({
  page: {
    padding: '45 40',
    fontFamily: 'Libre',
    fontSize: 9,
    lineHeight: 1.5,
    letterSpacing: 0.325,
    textAlign: 'justify',
  },
  header: {
    position: 'relative',
    textAlign: 'center',
    letterSpacing: 0,
  },
  phoneNumber: {
    position: 'absolute',
    left: '0',
    top: '30%',
    paddingLeft: 5,
  },
  name: {
    fontFamily: 'Libre Bold',
    fontSize: 19,
    letterSpacing: 0.075,
  },
  email: {
    position: 'absolute',
    right: '0',
    top: '30%',
    paddingRight: 5,
  },
  sectionTitle: {
    fontFamily: 'Libre Bold',
    paddingLeft: 5,
    marginBottom: 0,
  },
  educationContent: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 10,
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.85,
    marginBottom: 3,
  },
  justify: {
    fontSize: 20,
  },
  sectionHeader: {
    fontFamily: 'Libre Bold',
    textAlign: 'center',
    position: 'relative',
  },
  sectionHeaderLeft: {
    position: 'absolute',
    paddingLeft: 5,
    left: 0,
  },
  sectionHeaderRight: {
    position: 'absolute',
    paddingRight: 5,
    right: 0,
  },
  jobContent: {
    marginTop: 5,
    marginBottom: 10,
  },
});

Font.register({
  family: 'Libre',
  src: LibreBaskervilleRegular,
});

Font.register({
  family: 'Libre Bold',
  src: LibreBaskervilleBold,
});

export default function CV({
  profile,
  education,
  experience,
  projects,
  additional,
}) {
  const { name, email, phoneNumber, location } = profile;
  const {
    schoolName,
    titleOfStudy,
    gpa,
    fromDate,
    toDate,
    relevantCoursework,
  } = education;

  return (
    <Document
      title={name ? `${name}_resume` : 'resume'}
      pageLayout='singlePage'
      pageMode='fullScreen'
    >
      <Page size='A4' orientation='portrait' style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        {Object.values(education).some((v) =>
          Array.isArray(v) ? v.some((l) => l !== '') : v !== ''
        ) && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.hr} />
            <View style={styles.sectionHeader}>
              <Text>{schoolName}</Text>
              <Text
                style={styles.sectionHeaderRight}
              >{`${fromDate} - ${toDate}`}</Text>
            </View>
            <View style={styles.educationContent}>
              <Item style={{ marginBottom: 40 }}>
                {titleOfStudy}
                {gpa && `  (${gpa})`}.
              </Item>
              {relevantCoursework.some((v) => v !== '') && (
                <Item style={styles.justify}>
                  Relevant coursework:{'  '}
                  {relevantCoursework.join(', ')}.
                </Item>
              )}
            </View>
          </View>
        )}
        {experience.some((exp) =>
          Object.entries(exp).some(
            ([key, value]) =>
              key !== 'jobId' &&
              (Array.isArray(value)
                ? value.some((l) => l !== '')
                : value !== '')
          )
        ) && (
          <View>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.hr} />
            {experience.map((exp, i) => (
              <View key={i}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderLeft}>
                    {exp.positionTitle}
                  </Text>
                  <Text>{exp.companyName}</Text>
                  <Text style={styles.sectionHeaderRight}>
                    {exp.dateFrom} - {exp.dateUntil}
                  </Text>
                </View>
                <View style={styles.jobContent}>
                  {exp.responsibilities.map((resp, i) => (
                    <Item key={i}>{resp}</Item>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        {projects.some((proj) =>
          Object.entries(proj).some(
            ([key, value]) =>
              key !== 'projectId' &&
              (Array.isArray(value)
                ? value.some((l) => l !== '')
                : value !== '')
          )
        ) && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.hr} />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                marginBottom: 10,
              }}
            >
              {projects.map((proj, i) => (
                <View key={i}>
                  <View>
                    <ItemWithTitle
                      title={proj.projectTitle}
                      data={proj.projectDescription}
                    />
                    <ItemWithTitle
                      title={'Tech stack'}
                      data={`${proj.projectTechStack.join(', ')}.`}
                      noBulletpoint
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        {additional.some((exp) =>
          Object.entries(exp).some(
            ([key, value]) => key !== 'additionalId' && value !== ''
          )
        ) && (
          <View>
            <Text style={styles.sectionTitle}>
              Additional Experience / Volunteering
            </Text>
            <View style={styles.hr} />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                marginBottom: 10,
              }}
            >
              {additional.map((exp, i) => (
                <View key={i}>
                  <ItemWithTitle
                    title={`${exp.additionalTitle} (${exp.additionalDate})`}
                    data={exp.additionalDescription}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
    // <div className='cv'>
    //   <div className='paper'>
    //     <div className='profile'>
    //       <h2>{name}</h2>
    //       <div className='profile-subtitle'>
    //         <p>{location}</p>
    //         <p>{email}</p>
    //         <p>{phoneNumber}</p>
    //       </div>
    //     </div>
    //     {Object.values(education).some((value) => value !== '') && (
    //       <div className='education'>
    //         <h3>Education</h3>
    //         <hr />
    //         <div className='subtitle'>
    //           <h3 className='subtitle-left'>{schoolLocation}</h3>
    //           <h3 className='subtitle-center'>{schoolName}</h3>
    //           <h3 className='subtitle-right'>
    //             {fromDate} - {toDate}
    //           </h3>
    //         </div>
    //         <ul className='content'>
    //           {titleOfStudy !== '' && (
    //             <li>
    //               <p>&bull; {titleOfStudy}</p>
    //             </li>
    //           )}
    //           {gpa !== '' && (
    //             <li>
    //               <p>
    //                 &bull; <b>GPA: </b>
    //                 {gpa}
    //               </p>
    //             </li>
    //           )}
    //         </ul>
    //       </div>
    //     )}
    //     {Object.entries(experience[0]).some(([key, value]) => {
    //       if (key === 'jobId') return false;
    //       else if (key === 'responsibilities') {
    //         return value[0] !== '';
    //       } else return value !== '';
    //     }) && (
    //       <div className='experience'>
    //         <h3>Work Experience</h3>
    //         <hr />
    //         {experience.map((job) => {
    //           return (
    //             <div key={job} className='job-cv'>
    //               <div className='subtitle'>
    //                 <h3 className='subtitle-left'>{job.positionTitle}</h3>
    //                 <h3 className='subtitle-center'>{job.companyName}</h3>
    //                 <h3 className='subtitle-right'>
    //                   {job.dateFrom} {(job.dateFrom || job.dateFrom) && '-'}{' '}
    //                   {job.dateUntil}
    //                 </h3>
    //               </div>
    //               <p>{job.location}</p>
    //               <ul className='content'>
    //                 {job.responsibilities.map(
    //                   (responsibility) =>
    //                     responsibility !== '' && (
    //                       <li key={responsibility}>
    //                         <p>&bull; {responsibility}</p>
    //                       </li>
    //                     )
    //                 )}
    //               </ul>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}
