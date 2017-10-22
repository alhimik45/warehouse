import {AbstractIterator} from "./AbstractIterator";
import {IComparable} from "./IComparable";
import {Helpers} from "./Helpers";

export class InverseIterator<T extends IComparable> extends AbstractIterator<T> {
    private _comparables: Array<T>;
    private _current: number;

    constructor(comparables: Array<T> | AbstractIterator<T>) {
        super();
        let compColl: Array<T>;
        if (comparables instanceof AbstractIterator) {
            compColl = Helpers.enumerate(<AbstractIterator<T>>comparables)
        } else {
            compColl = <Array<T>>comparables;
        }
        this._comparables = compColl.slice().reverse();
        this._current = -1;
    }

    public current(): T {
        return this._comparables[this._current];
    }

    public moveNext(): boolean {
        ++this._current;
        return this._current < this._comparables.length;
    }

    public reset(): void {
        this._current = -1;
    }
}