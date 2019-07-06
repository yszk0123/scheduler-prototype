import React, { useCallback, useMemo, useState } from 'react';
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
      cross: false,
    },
    {
      id: 1,
      offset: 0.25,
      value: 0.32,
      color: Color.ORANGE,
      text: 'lunch',
      highlight: false,
      cross: false,
    },
    {
      id: 2,
      offset: 0.6,
      value: 0.18,
      color: Color.GREEN,
      text: 'running',
      highlight: true,
      cross: false,
    },
    {
      id: 3,
      offset: 0.8,
      value: 0.15,
      color: Color.ORANGE,
      text: 'dinner',
      highlight: false,
      cross: false,
    },
  ];
}

const App: React.FunctionComponent<{}> = () => {
  return <Example />;
};

function getCross(a: Schedule, b: Schedule): boolean {
  return b.offset < a.offset + a.value;
}
function calculateSchedules(schedules: Schedule[]): Schedule[] {
  const sorted = [...schedules].sort((a, b) => a.offset - b.offset);
  return sorted.map((schedule, i) => {
    const cross = i === 0 ? false : getCross(sorted[i - 1], schedule);
    return {
      ...schedule,
      cross,
    };
  });
}

const Example: React.FunctionComponent<{}> = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [otherSchedules] = useState(() => createSchedules());
  const [schedules, setSchedules] = useState(() => createSchedules());
  const sortedSchedules = useMemo(() => calculateSchedules(schedules), [
    schedules,
  ]);

  const onSelect = useCallback(
    (newSelectedId: number | null) => {
      const id =
        selectedId !== null || newSelectedId === selectedId
          ? null
          : newSelectedId;
      setSelectedId(id);
    },
    [selectedId],
  );

  const onChangeOffset = useCallback(
    (id: number, newOffset: number) => {
      const newSchedules = schedules.map(schedule =>
        schedule.id === id ? { ...schedule, offset: newOffset } : schedule,
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
            selectedId={null}
            radius={16}
            schedules={otherSchedules}
            onChangeOffset={noop}
            onSelect={noop}
          />
          <TimePicker
            selectedId={null}
            radius={16}
            schedules={otherSchedules}
            onChangeOffset={noop}
            onSelect={noop}
          />
          <TimePicker
            selectedId={null}
            radius={16}
            schedules={otherSchedules}
            onChangeOffset={noop}
            onSelect={noop}
          />
        </View>
        <TimePicker
          selectedId={selectedId}
          radius={60}
          schedules={sortedSchedules}
          onChangeOffset={onChangeOffset}
          onSelect={onSelect}
        />
        <ScheduleList selectedId={selectedId} schedules={sortedSchedules} />
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
