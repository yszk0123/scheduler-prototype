import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Color, Schedule } from '../AppType';
import { useGetDegree } from '../hooks/useGetDegree';
import { Pie } from './Pie';

const TimePicker: React.FunctionComponent<{
  selectedId: number | null;
  radius: number;
  schedules: Schedule[];
  onChangeOffset: (id: number, value: number) => void;
  onSelect: (id: number | null) => void;
}> = ({ selectedId, radius, schedules, onChangeOffset, onSelect }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const r2 = 2 * radius;
  const getDegree = useGetDegree(svgRef);
  const activeSchedule = useMemo(
    () => schedules.find(schedule => schedule.id === selectedId) || null,
    [selectedId, schedules],
  );
  const [activeOffset, setActiveOffset] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = useCallback(() => {
    if (selectedId !== null) {
      setDragging(true);
    }
  }, [selectedId]);

  const onMouseUp = useCallback(() => {
    if (dragging && selectedId !== null && activeOffset !== null) {
      onChangeOffset(selectedId, activeOffset);
      setDragging(false);
    }
  }, [dragging, activeOffset, selectedId, onChangeOffset]);

  const onMove = useCallback(
    (event: MouseEvent) => {
      if (activeSchedule === null) {
        return;
      }

      const newOffset = (getDegree(event) || 0) / 360;
      setActiveOffset(updateOffset(activeSchedule, newOffset));
    },
    [getDegree, activeSchedule],
  );

  useEffect(() => {
    const schedule = schedules.find(s => s.id === selectedId);
    setActiveOffset(schedule ? schedule.offset : null);
  }, [selectedId, schedules]);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    document.body.addEventListener('mousemove', onMove);
    return () => {
      document.body.removeEventListener('mousemove', onMove);
    };
  }, [dragging, onMove]);

  return (
    <svg
      ref={svgRef}
      style={{ borderRadius: '50%' }}
      width={r2}
      height={r2}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <g transform={`translate(${radius}, ${radius})`}>
        <Pie
          back
          active
          radius={radius}
          color={Color.WHITE}
          onPress={() => onSelect(null)}
        />
        {schedules.map(({ id, cross, color, offset, value }) => {
          const active = selectedId === id;
          const finalOffset = active ? activeOffset || offset : offset;

          return (
            <Fragment key={id}>
              {active && (
                <Pie
                  active
                  cross={cross}
                  radius={radius}
                  color={color}
                  offset={finalOffset}
                  value={value}
                  onPress={() => onSelect(id)}
                />
              )}
              <Pie
                active={false}
                cross={cross}
                radius={radius}
                color={color}
                offset={finalOffset}
                value={value}
                onPress={() => onSelect(id)}
              />
            </Fragment>
          );
        })}
      </g>
    </svg>
  );
};

function updateOffset(schedule: Schedule, newOffset: number): number {
  return Math.min(newOffset, 0.999999 - schedule.value);
}

const MemoizedTimePicker = React.memo(TimePicker);
export { MemoizedTimePicker as TimePicker };
