export default function onlyOneDefined<T extends Record<string, unknown>>(obj: T) {
  return Object.values(obj).filter((v) => v !== undefined).length === 1;
}
