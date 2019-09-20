



export function flat<T>(arr: any[], depth: number): T[] {
    return arr.reduce(function (flatened, toFlatten) {
        return flatened.concat((Array.isArray(toFlatten) && (depth > 1)) ? flat(toFlatten, depth - 1) : toFlatten);
      }, []);
}

export function without<T>(arr: T[], ...exclude: T[]): T[] {
    return arr.filter(element => !exclude.includes(element));
}

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}