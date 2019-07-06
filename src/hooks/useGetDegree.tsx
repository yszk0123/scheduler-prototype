import React, { useCallback, useEffect, useState } from 'react';

/**
 * @see https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
 */
export function useGetDegree(svgRef: React.RefObject<SVGSVGElement>) {
  const [point, setPoint] = useState<DOMPoint | null>(null);
  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }
    const newPoint = svgRef.current.createSVGPoint(); // Created once for document
    setPoint(newPoint);
  }, [svgRef]);
  const getDegree = useCallback(
    (event: React.MouseEvent<unknown> | MouseEvent) => {
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
