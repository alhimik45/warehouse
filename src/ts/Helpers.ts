import {AbstractIterator} from "./AbstractIterator";
import {IComparable} from "./IComparable";

export class Helpers {
    public static enumerate<T extends IComparable>(iter: AbstractIterator<T>): Array<T> {
        let res: Array<T> = [];
        iter.reset();
        while (iter.moveNext()) {
            res.push(iter.current())
        }
        return res;
    }
}