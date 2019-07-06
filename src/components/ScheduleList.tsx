import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../AppConstant';
import { Schedule } from '../AppType';

const ScheduleList: React.FunctionComponent<{
  schedules: Schedule[];
  selectedId: number | null;
}> = ({ schedules, selectedId }) => {
  return (
    <View style={styles.scheduleList}>
      {schedules.map(({ id, color, text }) => {
        const active = id === selectedId;
        return (
          <View key={id} style={styles.scheduleItem}>
            <View
              style={[
                {
                  backgroundColor: active
                    ? colors[color].active
                    : colors[color].inactive,
                },
                styles.scheduleMark,
              ]}
            />
            <Text>{text}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export { ScheduleList };
