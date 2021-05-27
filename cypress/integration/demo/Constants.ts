export const calculateSum = (collection, property = undefined) =>
  collection.reduce(
    (total, item) =>
      +(
        +total.toFixed(2) +
        +(+(property ? getValue(item, property) || 0 : item || 0)).toFixed(2)
      ).toFixed(2),
    0
  );

export const calculateSubtraction = (collection, property = undefined) =>
  collection.reduce((total, item) => {
    const _item = +(+(property
      ? getValue(item, property) ?? 0
      : item ?? 0)).toFixed(2);

    if (!total) return _item;

    return +(+total.toFixed(2) - _item).toFixed(2);
  }, null);

export const calculateMultiplication = (collection, property = undefined) =>
  collection.reduce(
    (total, item) =>
      +(
        +total.toFixed(2) *
        +(+(property ? getValue(item, property) ?? 1 : item ?? 1)).toFixed(2)
      ).toFixed(2),
    1
  );

export const calculateDivision = (collection, property = undefined) =>
  collection.reduce((total, item) => {
    const _item = +(+(property
      ? getValue(item, property) ?? 1
      : item ?? 1)).toFixed(2);

    if (!total) return _item;

    return +(+total.toFixed(2) / _item).toFixed(2);
  }, null);

export const getValue = (obj, prop) => {
  const props = prop.split(".");
  let value = obj;
  props.forEach((_prop) => {
    value = value[_prop];
  });
  return value;
};
