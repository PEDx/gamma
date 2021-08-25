export function uuid() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
    },
  );
  return uuid;
}

export function shallowClone(value: any) {
  if (typeof value === 'object' && value !== null) {
    return { ...value };
  }
  return Array.isArray(value) ? [...value] : value;
}

export function isEmpty(value: unknown) {
  return !(!!value
    ? typeof value === 'object'
      ? Array.isArray(value)
        ? !!value.length
        : !!Object.keys(value!).length
      : true
    : false);
}

export function isNil(value: unknown) {
  return value == null;
}

export function remove<T>(array: T[], value: T) {
  const index = array.indexOf(value);
  if (index > -1) array.splice(index, 1);
}
