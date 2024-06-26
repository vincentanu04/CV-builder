import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
  },
  bulletPoint: {
    width: 12,
  },
});

const List = ({ children }) => children;

export const Item = ({ children }) => (
  <View style={styles.item}>
    <Text style={styles.bulletPoint}>•</Text>
    <Text style={{ width: '100%', paddingRight: 5 }}>{children}</Text>
  </View>
);

export default List;
