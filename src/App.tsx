import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { schedules } from './AppConstant';
import { Box } from './Box';
import { ScheduleList } from './ScheduleList';
import { TimePicker } from './TimePicker';

const App: React.FunctionComponent<{}> = () => {
  return <Example />;
};

const Example: React.FunctionComponent<{}> = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onSelect = useCallback((newSelectedId: number | null) => {
    setSelectedId(newSelectedId);
  }, []);

  const onChangeValue = useCallback((newValue: number) => {
    //setValue(newValue);
  }, []);

  return (
    <Box>
      <View style={styles.container}>
        <View style={styles.bar}>
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={onChangeValue}
            onSelect={onSelect}
          />
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={onChangeValue}
            onSelect={onSelect}
          />
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={onChangeValue}
            onSelect={onSelect}
          />
        </View>
        <TimePicker
          selectedId={selectedId}
          radius={60}
          schedules={schedules}
          onChangeValue={onChangeValue}
          onSelect={onSelect}
        />
        <ScheduleList selectedId={selectedId} schedules={schedules} />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    left: 50,
    top: 20,
  },
  bar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export { App };
