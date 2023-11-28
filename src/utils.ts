import { useCallback, useRef } from "react";

export function decycle(obj: any, stack: any[] = []): any {
  if (!obj || typeof obj !== 'object')
    return obj;

  if (stack.includes(obj))
    return null;

  let s = stack.concat([obj]);

  return Array.isArray(obj)
    ? obj.map(x => decycle(x, s))
    : Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, decycle(v, s)]));
}

export function compareObjects(a: Object, b: Object) {
  // TODO: very rough, needs to be rewritten in a better way
  return JSON.stringify(decycle(a)) === JSON.stringify(decycle(b))
}


export function promsify(fn: () => unknown | void) {
  const res = fn();
  return res instanceof Promise ? res : Promise.resolve(res)
}

export function shorid() {
  return (Math.random() + 1).toString(36).substring(7)
}


export function useLock() {
  const lockRef = useRef(false);

  const oneTimeCall = useCallback((handler: () => void) => {
    if (lockRef.current === false) {
      lockRef.current = true;

      handler()
    }
  }, []);

  return oneTimeCall
}
