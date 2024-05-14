import {
  Document,
  Font,
  G,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import './CV.css';
import LibreBaskervilleRegular from '/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf';
import LibreBaskervilleBold from '/fonts/Libre_Baskerville/LibreBaskerville-Bold.ttf';
import LibreBaskervilleItalic from '/fonts/Libre_Baskerville/LibreBaskerville-Italic.ttf';
import { Item } from './components/List';
import { ItemWithTitle } from './components/ItemWithTitle';

const styles = StyleSheet.create({
  page: {
    padding: '45',
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
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: 0.075,
  },
  email: {
    position: 'absolute',
    right: '0',
    top: '30%',
    paddingRight: 5,
  },
  sectionTitle: {
    fontWeight: 700,
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
    fontWeight: 700,
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
  sectionContent: {
    marginTop: 2,
    marginBottom: 10,
  },
});

Font.register({
  family: 'Libre',
  fonts: [
    {
      src: LibreBaskervilleRegular,
      fontWeight: 400,
    },
    { src: LibreBaskervilleBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'Libre Italic',
  src: LibreBaskervilleItalic,
});

export default function CV({
  profile,
  education,
  experience,
  projects,
  additional,
  skills,
  remarks,
}) {
  const { name, email, phoneNumber, github, linkedin } = profile;
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
      subject={name ? `${name}_resume` : 'resume'}
      pageLayout='singlePage'
      pageMode='fullScreen'
    >
      <Page size='A4' orientation='portrait' style={styles.page}>
        <View
          style={{
            ...styles.header,
            marginBottom: `${!linkedin && !github && 20}`,
          }}
        >
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 7.5,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            paddingRight: 5,
          }}
        >
          {github && (
            <Link href={github}>
              <Svg
                width='30'
                height='30'
                viewBox='0 0 98 96'
                xmlns='http://www.w3.org/2000/svg'
                style={{}}
              >
                <Path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
                  fill='#24292f'
                />
              </Svg>
            </Link>
          )}
          {linkedin && (
            <Link href={linkedin}>
              <Svg
                width='27'
                height='27'
                viewBox='0 0 72 72'
                xmlns='http://www.w3.org/2000/svg'
              >
                <G fill='none' fill-rule='evenodd'>
                  <Path
                    d='M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z'
                    fill='#007EBB'
                  />
                  <Path
                    d='M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z'
                    fill='#FFF'
                  />
                </G>
              </Svg>
            </Link>
          )}
        </View>
        {Object.values(education).some((v) =>
          Array.isArray(v) ? v.some((l) => l !== '') : v !== ''
        ) && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.hr} />
            <View style={styles.sectionHeader}>
              <Text>{schoolName}</Text>
              <Text style={styles.sectionHeaderRight}>
                {fromDate && toDate
                  ? `${fromDate} - ${toDate}`
                  : fromDate
                  ? fromDate
                  : toDate}
              </Text>
            </View>
            <View style={styles.educationContent}>
              {titleOfStudy && (
                <Item style={{ marginBottom: 40 }}>
                  {titleOfStudy}
                  {gpa && `  (${gpa})`}.
                </Item>
              )}
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
                    {exp.dateFrom} {(exp.dateFrom || exp.dateUntil) && ' - '}{' '}
                    {exp.dateUntil}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.jobContent,
                    ...(!exp.companyName ? { marginTop: 20 } : {}),
                  }}
                >
                  {exp.responsibilities.map(
                    (resp, i) => resp && <Item key={i}>{resp}</Item>
                  )}
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
                ...styles.sectionContent,
              }}
            >
              {projects.map((proj, i) => (
                <View key={i}>
                  <View
                    style={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <ItemWithTitle
                      title={proj.projectTitle}
                      data={proj.projectDescription}
                    />
                    {proj.projectTechStack.some((v) => v !== '') && (
                      <ItemWithTitle
                        title={'Tech stack'}
                        data={`${proj.projectTechStack.join(', ')}.`}
                        noBulletpoint
                      />
                    )}
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
                ...styles.sectionContent,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
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
        {Object.values(skills).some((v) => v.some((l) => l !== '')) && (
          <View>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.hr} />
            <View style={styles.sectionContent}>
              <Item>{skills.general.join(', ')}.</Item>
              <ItemWithTitle
                title={'Databases'}
                data={`${skills.databases.join(', ')}.`}
              />
              <ItemWithTitle
                title={'Languages'}
                data={`${skills.languages.join(', ')}.`}
              />
              <ItemWithTitle
                title={'Others'}
                data={`${skills.others.join(', ')}.`}
              />
            </View>
          </View>
        )}
        <View
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          <Text>{remarks.remarks}</Text>
        </View>
      </Page>
    </Document>
  );
}
