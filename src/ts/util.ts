export function selectIndexes<T>(arr:Array<T>, indexes:Array<number>):Array<T> {
    let res:Array<T> = [];
    for (let i of indexes) {
        res.push(arr[i]);
    }
    return res;
}