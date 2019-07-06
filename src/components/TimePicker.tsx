import React, { useCallback, useRef } from 'react';
import { Color, Schedule } from '../AppType';
import { useGetDegree } from '../hooks/useGetDegree';
import { Pie } from './Pie';

const TimePicker: React.FunctionComponent<{
  selectedId: number | null;
  radius: number;
  schedules: Schedule[];
  onChangeValue: (id: number, value: number) => void;
  onSelect: (id: number | null) => void;
}> = ({ selectedId, radius, schedules, onChangeValue, onSelect }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const r2 = 2 * radius;
  const getDegree = useGetDegree(svgRef);
  const activeSchedule = schedules.find(schedule => schedule.id === selectedId);

  const onMove = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      if (selectedId === null) {
        return;
      }
      const newValue = (getDegree(event) || 0) / 360;
      onChangeValue(selectedId, newValue);
    },
    [getDegree, selectedId, onChangeValue],
  );

  return (
    <svg
      ref={svgRef}
      style={{ borderRadius: '50%' }}
      width={r2}
      height={r2}
      onMouseMove={onMove}
    >
      <g transform={`translate(${radius}, ${radius})`}>
        <Pie
          back
          active
          radius={radius}
          color={Color.WHITE}
          onPress={() => onSelect(null)}
        />
        {activeSchedule !== undefined && (
          <Pie
            key={activeSchedule.id}
            active
            radius={radius}
            color={activeSchedule.color}
            offset={activeSchedule.offset}
            value={activeSchedule.value}
            onPress={() => onSelect(activeSchedule.id)}
          />
        )}
        {schedules.map(({ id, color, offset, value }) => {
          return (
            <Pie
              key={id}
              active={false}
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

export { TimePicker };
