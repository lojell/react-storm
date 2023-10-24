
function decycle(obj: any, stack: any[] = []): any {
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
  // return JSON.stringify(a) === JSON.stringify(b)

  return JSON.stringify(decycle(a)) === JSON.stringify(decycle(b))
}