import React from 'react';
import { colors } from '../AppConstant';
import { Color } from '../AppType';

const Pie = ({
  back = false,
  active,
  cross = false,
  offset = 0,
  value = 1,
  radius,
  color = Color.WHITE,
  onPress,
  onMove,
}: {
  back?: boolean;
  active: boolean;
  cross?: boolean;
  offset?: number;
  value?: number;
  radius: number;
  color: Color;
  onPress?: () => void;
  onMove?: (event: React.MouseEvent<SVGElement>) => void;
}) => {
  let width = (back ? 0.75 : active ? 1 : 0.5) * radius;
  if (cross) {
    width *= 0.5;
  }

  return (
    <RawPie
      offset={offset}
      value={value}
      radius={radius}
      width={width}
      color={active ? colors[color].active : colors[color].inactive}
      onPress={onPress}
      onMove={onMove}
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
  onMove,
}: {
  offset?: number;
  value?: number;
  width?: number;
  radius: number;
  color: string;
  onPress?: () => void;
  onMove?: (event: React.MouseEvent<SVGElement>) => void;
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
      onMouseMove={onMove}
    />
  );
};

export { Pie };
