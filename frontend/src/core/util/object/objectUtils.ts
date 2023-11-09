/**
 * Adds `null` as a possible value for all
 */
type Nullable<T> = {
  [Key in keyof T]: T[Key] | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterObject<Obj extends Record<string, any>>(predicateFn: (key: keyof Obj, value: any) => boolean) {
  return (object: Nullable<Obj>): Obj =>
    Object.entries(object).reduce((filtered, [key, value]) => {
      if (predicateFn(key, value)) {
        filtered[key] = value
      }

      return filtered
    }, {}) as Obj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterTruthyObjectValues<Obj extends Record<string, any>>(object: Nullable<Obj>) {
  return filterObject<Obj>((_key, value) => Boolean(value))(object)
}

export { filterTruthyObjectValues }
