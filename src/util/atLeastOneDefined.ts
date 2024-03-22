export default function atLeastOneDefined<T extends Record<string, unknown>>(obj: T) {
  return Object.values(obj).some((v) => v !== undefined);
}
