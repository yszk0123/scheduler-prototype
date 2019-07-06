import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

const Box: React.FunctionComponent<ViewProps> = props => {
  return <View {...props} style={styles.box} />;
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'lightgray',
  },
  container: {
    position: 'relative',
    left: 50,
    top: 20,
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
  },
  scheduleItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
  },
  scheduleMark: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  bar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export { Box };
