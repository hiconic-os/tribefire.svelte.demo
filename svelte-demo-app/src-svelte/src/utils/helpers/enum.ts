export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export function enumValues<O extends object, K extends keyof O = keyof O>(obj: O):string[] {
  return enumKeys(obj).map(key => obj[key]) as unknown as string[];
}
