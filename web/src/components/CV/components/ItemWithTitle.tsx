import { Text, View, StyleSheet } from '@react-pdf/renderer';

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
    fontWeight: 700,
  },
  normalText: {
    fontWeight: 400,
  },
});

interface ItemWithTitleProps {
  title: string;
  data: string;
  noBulletpoint?: boolean;
}

export const ItemWithTitle = ({
  title,
  data,
  noBulletpoint = false,
}: ItemWithTitleProps) => (
  <View style={styles.item}>
    <Text style={[noBulletpoint ? styles.invisible : {}, styles.bulletPoint]}>
      •
    </Text>
    <Text style={{ display: 'flex', width: '100%' }}>
      <Text style={styles.boldText}>{title}</Text>
      {title && data && <Text>:{'  '}</Text>}
      <Text style={styles.normalText}>{data}</Text>
    </Text>
  </View>
);
