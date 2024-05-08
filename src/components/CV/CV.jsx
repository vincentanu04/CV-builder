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

const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontFamily: 'Libre',
    fontSize: 7.5,
  },
  header: {
    position: 'relative',
    textAlign: 'center',
  },
  phoneNumber: {
    position: 'absolute',
    left: 0,
    top: '40%',
  },
  name: {
    fontFamily: 'Libre Bold',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.075,
  },
  email: {
    position: 'absolute',
    right: 0,
    top: '40%',
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

export default function CV({ profile, education, experience }) {
  const { name, email, phoneNumber, location } = profile;
  const { schoolName, schoolLocation, titleOfStudy, gpa, fromDate, toDate } =
    education;

  return (
    <Document
      title={profile.name ? `${profile.name}_resume` : 'resume'}
      pageLayout='singlePage'
      pageMode='fullScreen'
    >
      <Page size='A4' orientation='portrait' style={styles.page} debug>
        <View style={styles.header}>
          <Text style={styles.phoneNumber}>{profile.phoneNumber}</Text>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
        <Text>
          <hr />
        </Text>
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
