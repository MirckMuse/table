
interface FilterName {
  value: string;

  children: string;
}

const DefaultFiledName = { value: "value", children: "children" }

// 扁平
export function flattenKeys<K>(options?: any[], filedName?: FilterName): K[] {

  const _flattenKeys: K[] = [];
  const { value: valueKey, children: childrenKey } = Object.assign({}, DefaultFiledName, filedName);

  let _options = ([] as any[]).concat(options ?? []);

  while (_options.length) {
    const top = _options.shift();

    if (!top) break;

    const value = top[valueKey] as K;

    _flattenKeys.push(value);

    if (top[childrenKey]?.length) {
      _options = _options.concat(top[childrenKey])
    }
  }

  return _flattenKeys;
}