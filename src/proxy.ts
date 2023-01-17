export function proxyMethodCalls(obj: any, postAction: () => void) {
  for (const propKey of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
    const originalMethod = obj[propKey];
    if (typeof originalMethod == 'function' && !(propKey as string).startsWith('_') && propKey !== 'constructor') {
      // TODO: enhance via decorators + metadata
      obj[propKey] = function (...args: IArguments[]) {
        // @ts-ignore
        const result = originalMethod.apply(obj, args);
        // Doesn't matter if it's Promise or not we should call update after all
        return Promise.resolve(result).then((value) => {
          postAction();
          return value;
        });
      };
    }
  }

  return obj;
}