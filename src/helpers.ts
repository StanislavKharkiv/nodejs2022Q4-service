export function omit<T>(obj: T, name: keyof T) {
  const newObject = { ...obj };
  delete newObject[name];
  return newObject;
}

export function hasProperties(
  obj: Record<any, any>,
  properties: { name: string; type: string[] }[],
) {
  return properties.every(
    (item) =>
      item.name in obj &&
      item.type.includes(
        obj[item.name] === null ? 'null' : typeof obj[item.name],
      ),
  );
}
