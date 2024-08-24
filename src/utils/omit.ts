// prettier-ignore
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const copiedObj = { ...obj }
    keys.forEach((key) => delete copiedObj[key])
    return copiedObj
}
