import { useMemo } from 'react';
import hash from 'stable-hash';

export function useStableMemo<T>(factory: () => T, deps: any[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, [hash(deps)]);
}
