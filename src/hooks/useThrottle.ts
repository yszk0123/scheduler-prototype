/**
 * @see https://github.com/streamich/react-use/issues/372
 */
import { throttle } from 'lodash';
import { useEffect, useMemo } from 'react';

export function useThrottle<T extends (...args: any) => any>(
  callback: T,
  ms: number,
) {
  const throttledFn = useMemo(() => {
    return throttle(callback, ms);
  }, [callback, ms]);

  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);

  return throttledFn;
}
