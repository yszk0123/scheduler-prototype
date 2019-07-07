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

enum DragType {
  NONE = 'NONE',
  MOVE = 'MOVE',
  OFFSET = 'OFFSET',
  VALUE = 'VALUE',
}

const TimePicker: React.FunctionComponent<{
  selectedId: number | null;
  radius: number;
  schedules: Schedule[];
  onChange: (id: number, v: { offset: number; value: number }) => void;
  onSelect: (id: number | null) => void;
}> = ({ selectedId, radius, schedules, onChange, onSelect }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const r2 = 2 * radius;
  const getDegree = useGetDegree(svgRef);
  const activeSchedule = useMemo(
    () => schedules.find(schedule => schedule.id === selectedId) || null,
    [selectedId, schedules],
  );
  const [degree, setDegree] = useState<number | null>(null);
  const [activeOffset, setActiveOffset] = useState<number | null>(null);
  const [activeValue, setActiveValue] = useState<number | null>(null);
  const [dragType, setDragType] = useState(DragType.NONE);

  const onMouseDownMove = useCallback(
    (event: React.MouseEvent) => {
      if (selectedId !== null) {
        setDragType(DragType.MOVE);
        setDegree((getDegree(event) || 0) / 360);
      }
    },
    [selectedId, getDegree],
  );

  const onMouseDownOffset = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (selectedId !== null) {
        setDragType(DragType.OFFSET);
        setDegree((getDegree(event) || 0) / 360);
      }
    },
    [selectedId, getDegree],
  );

  const onMouseDownValue = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (selectedId !== null) {
        setDragType(DragType.VALUE);
        setDegree((getDegree(event) || 0) / 360);
      }
    },
    [selectedId, getDegree],
  );

  const onMouseUp = useCallback(() => {
    if (
      dragType !== DragType.NONE &&
      selectedId !== null &&
      activeOffset !== null &&
      activeValue !== null
    ) {
      onChange(selectedId, { offset: activeOffset, value: activeValue });
    }
    setDragType(DragType.NONE);
  }, [dragType, activeOffset, selectedId, onChange]);

  const onMove = useCallback(
    (event: MouseEvent) => {
      if (activeSchedule === null || degree === null) {
        return;
      }

      const newDegree = (getDegree(event) || 0) / 360;
      const dd = newDegree - degree;
      if (dragType === DragType.MOVE) {
        setActiveOffset(updateOffset(activeSchedule, dd));
      }
      if (dragType === DragType.OFFSET) {
        setActiveOffset(updateOffset(activeSchedule, dd));
        setActiveValue(updateValue(activeSchedule, -dd));
      }
      if (dragType === DragType.VALUE) {
        setActiveValue(updateValue(activeSchedule, dd));
      }
    },
    [getDegree, degree, dragType, activeSchedule],
  );

  useEffect(() => {
    const schedule = schedules.find(s => s.id === selectedId);
    setActiveOffset(schedule ? schedule.offset : null);
  }, [selectedId, schedules]);

  useEffect(() => {
    if (dragType === DragType.NONE) {
      return;
    }

    document.body.addEventListener('mousemove', onMove);
    return () => {
      document.body.removeEventListener('mousemove', onMove);
    };
  }, [dragType, onMove]);

  return (
    <svg
      ref={svgRef}
      style={{ borderRadius: '50%' }}
      width={r2}
      height={r2}
      onMouseDown={onMouseDownMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
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
          const finalValue = active ? activeValue || value : value;
          const HANDLE_RATE = 0.015;

          return (
            <Fragment key={id}>
              {active && (
                <>
                  <Pie
                    active
                    cross={cross}
                    radius={radius}
                    color={color}
                    offset={finalOffset}
                    value={finalValue}
                    onUp={onMouseUp}
                  />
                  <Pie
                    active
                    cross={cross}
                    radius={radius}
                    color={Color.BLACK}
                    offset={finalOffset}
                    value={HANDLE_RATE}
                    onDown={onMouseDownOffset}
                    onUp={onMouseUp}
                  />
                  <Pie
                    active
                    cross={cross}
                    radius={radius}
                    color={Color.BLACK}
                    offset={finalOffset + finalValue - HANDLE_RATE}
                    value={HANDLE_RATE}
                    onDown={onMouseDownValue}
                    onUp={onMouseUp}
                  />
                </>
              )}
              <Pie
                active={false}
                cross={cross}
                radius={radius}
                color={color}
                offset={finalOffset}
                value={finalValue}
                onPress={() => onSelect(id)}
              />
            </Fragment>
          );
        })}
      </g>
    </svg>
  );
};

function updateOffset(schedule: Schedule, dd: number): number {
  return Math.min(schedule.offset + dd, 0.999999 - schedule.value);
}
function updateValue(schedule: Schedule, dd: number): number {
  return Math.max(schedule.value + dd, 0.1);
}

const MemoizedTimePicker = React.memo(TimePicker);
export { MemoizedTimePicker as TimePicker };
