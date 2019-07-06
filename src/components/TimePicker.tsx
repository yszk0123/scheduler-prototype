import React, { useCallback, useRef } from 'react';
import { Color, Schedule } from '../AppType';
import { useGetDegree } from '../hooks/useGetDegree';
import { Pie } from './Pie';

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

export { TimePicker };
