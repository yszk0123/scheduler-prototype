import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { noop } from '../AppHelper';
import { Color, Schedule } from '../AppType';
import { Box } from './Box';
import { ScheduleList } from './ScheduleList';
import { TimePicker } from './TimePicker';

function createSchedules(): Schedule[] {
  return [
    {
      id: 0,
      offset: 0,
      value: 0.2,
      color: Color.GREEN,
      text: 'breakfast',
      highlight: false,
    },
    {
      id: 1,
      offset: 0.25,
      value: 0.32,
      color: Color.ORANGE,
      text: 'lunch',
      highlight: false,
    },
    {
      id: 2,
      offset: 0.6,
      value: 0.18,
      color: Color.GREEN,
      text: 'running',
      highlight: true,
    },
    {
      id: 3,
      offset: 0.8,
      value: 0.15,
      color: Color.ORANGE,
      text: 'dinner',
      highlight: false,
    },
  ];
}

const App: React.FunctionComponent<{}> = () => {
  return <Example />;
};

function updateOffset(schedule: Schedule, newOffset: number): Schedule {
  const fixedOffset = Math.min(newOffset, 0.999999 - schedule.value);
  return { ...schedule, offset: fixedOffset };
}

const Example: React.FunctionComponent<{}> = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState(() => createSchedules());

  const onSelect = useCallback(
    (newSelectedId: number | null) => {
      const id = newSelectedId === selectedId ? null : newSelectedId;
      setSelectedId(id);
    },
    [selectedId],
  );

  const onChangeValue = useCallback(
    (id: number, newValue: number) => {
      const newSchedules = schedules.map(schedule =>
        schedule.id === id ? updateOffset(schedule, newValue) : schedule,
      );
      setSchedules(newSchedules);
    },
    [schedules],
  );

  return (
    <Box>
      <View style={styles.container}>
        <View style={styles.bar}>
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={noop}
            onSelect={onSelect}
          />
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={noop}
            onSelect={onSelect}
          />
          <TimePicker
            selectedId={selectedId}
            radius={16}
            schedules={schedules}
            onChangeValue={noop}
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
