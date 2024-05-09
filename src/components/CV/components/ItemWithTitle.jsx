import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import LibreBaskervilleRegular from '/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf';
import LibreBaskervilleBold from '/fonts/Libre_Baskerville/LibreBaskerville-Bold.ttf';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingRight: 5,
  },
  bulletPoint: {
    width: 12,
  },
  invisible: { opacity: 0 },
  boldText: {
    fontFamily: 'Libre Bold',
  },
  normalText: {
    fontFamily: 'Libre',
    fontWeight: 'normal',
  },
});

Font.register({
  family: 'Libre Bold',
  src: LibreBaskervilleBold,
});

Font.register({
  family: 'Libre',
  src: LibreBaskervilleRegular,
});

export const ItemWithTitle = ({ title, data, noBulletpoint = false }) => (
  <View style={styles.item}>
    <Text style={[noBulletpoint && styles.invisible, styles.bulletPoint]}>
      •
    </Text>
    <Text style={{ display: 'flex', width: '100%', fontFamily: 'Libre' }}>
      <Text style={{ fontWeight: 700 }}>{title}</Text>
      <Text>: </Text>
      <Text style={{ ...styles.normalText }}>{data}</Text>
    </Text>
  </View>
);
