export function omit<T>(obj: T, name: keyof T) {
  const newObject = { ...obj };
  delete newObject[name];
  return newObject;
}

export function hasProperties(obj: Record<any, any>, properties: string[]) {
  return properties.every((item) => item in obj);
}
