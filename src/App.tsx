import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

const App: React.FunctionComponent<{}> = () => {
  return <Example />;
};

export type ScheduleModel = {
  type: string;
  id: string;
  offset: number;
  value: number;
  text: string;
};
export enum Color {
  WHITE = 'WHITE',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
}
export type Schedule = {
  color: Color;
  id: number;
  offset: number;
  value: number;
  text: string;
  highlight: boolean;
};

const schedules: Schedule[] = [
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

type ColorTheme = {
  active: string;
  inactive: string;
};

const colors: Record<Color, ColorTheme> = {
  [Color.WHITE]: {
    active: 'white',
    inactive: 'white',
  },
  [Color.GREEN]: {
    active: '#4c8c4a',
    inactive: '#1b5e20',
  },
  [Color.ORANGE]: {
    active: '#ffa040',
    inactive: '#ff6f00',
  },
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

const Box: React.FunctionComponent<ViewProps> = props => {
  return <View {...props} style={styles.box} />;
};

function calculateDegree(
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  const dx = x - width / 2;
  const dy = y - height / 2;
  return positionToDegree(dx, -dy);
}
function positionToDegree(x: number, y: number): number {
  const deg = (Math.atan2(x, y) * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg;
}

/**
 * @see https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
 */
function useGetDegree(svgRef: React.RefObject<SVGSVGElement>) {
  const [point, setPoint] = useState<DOMPoint | null>(null);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }
    const newPoint = svgRef.current.createSVGPoint(); // Created once for document
    setPoint(newPoint);
  }, [svgRef]);

  const getDegree = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (point === null || svgRef.current === null) {
        return;
      }

      point.x = event.clientX;
      point.y = event.clientY;

      const rect = svgRef.current.getBoundingClientRect();
      const { x, y } = point.matrixTransform(
        svgRef.current.getScreenCTM()!.inverse(),
      );
      return calculateDegree(x, y, rect.width, rect.height);
    },
    [point, svgRef],
  );

  return getDegree;
}

const TimePicker: React.FunctionComponent<{
  selectedId: number | null;
  radius: number;
  schedules: Schedule[];
  onChangeValue: (value: number) => void;
  onSelect: (id: number | null) => void;
}> = ({ selectedId, radius, schedules, onChangeValue, onSelect }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const r2 = 2 * radius;
  const getDegree = useGetDegree(svgRef);

  const onPress = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const newValue = (getDegree(event) || 0) / 360;
      onChangeValue(newValue);
    },
    [getDegree, onChangeValue],
  );

  return (
    <svg
      ref={svgRef}
      style={{ borderRadius: '50%' }}
      width={r2}
      height={r2}
      onClick={onPress}
    >
      <g transform={`translate(${radius}, ${radius})`}>
        <Pie
          back
          active
          radius={radius}
          color={Color.WHITE}
          onPress={() => onSelect(null)}
        />
        {schedules.map(({ id, color, offset, value }) => {
          return (
            <Pie
              key={id}
              active={id === selectedId}
              radius={radius}
              color={color}
              offset={offset}
              value={value}
              onPress={() => onSelect(id)}
            />
          );
        })}
      </g>
    </svg>
  );
};

const Pie = ({
  back = false,
  active,
  offset = 0,
  value = 1,
  radius,
  color = Color.WHITE,
  onPress,
}: {
  back?: boolean;
  active: boolean;
  offset?: number;
  value?: number;
  radius: number;
  color: Color;
  onPress?: () => void;
}) => {
  const width = (back ? 0.75 : active ? 1 : 0.5) * radius;
  return (
    <RawPie
      offset={offset}
      value={value}
      radius={radius}
      width={width}
      color={active ? colors[color].active : colors[color].inactive}
      onPress={onPress}
    />
  );
};

const RawPie = ({
  offset = 0,
  value = 1,
  radius,
  width = radius,
  color,
  onPress,
}: {
  offset?: number;
  value?: number;
  width?: number;
  radius: number;
  color: string;
  onPress?: () => void;
}) => {
  const r2 = radius / 2;
  const length = 2 * Math.PI * r2;
  const dasharray =
    offset + value < 1 ? [value * length, length].join(',') : undefined;
  const a = 360 * offset - 90;

  return (
    <circle
      transform={`rotate(${a},0,0)`}
      r={r2}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dasharray}
      onClick={onPress}
    />
  );
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

export { App };
