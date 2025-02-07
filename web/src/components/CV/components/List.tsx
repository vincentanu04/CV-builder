import { Text, View, StyleSheet, Styles } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    fontSize: 9,
  },
  bulletPoint: {
    width: 12,
  },
});

interface ListProps {
  children: React.ReactNode;
}

const List = ({ children }: ListProps) => children;

interface ItemProps {
  children: React.ReactNode;
  style?: any;
}

export const Item = ({ children, style }: ItemProps) => (
  <View style={[style, styles.item]}>
    <Text style={styles.bulletPoint}>•</Text>
    <Text style={{ width: '100%', paddingRight: 5 }}>{children}</Text>
  </View>
);

export default List;
