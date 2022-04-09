
export function activate<T>(TCreator: { new(): T; }): T {
  return new TCreator();
}