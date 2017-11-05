import {AbstractIterator} from "./AbstractIterator";
import {IComparable} from "./IComparable";
import {Helpers} from "./Helpers";

export class FilterIterator<T extends IComparable> extends AbstractIterator<T> {
    private _comparables: Array<T>;
    private _current: number;

    constructor(comparables: Array<T> | AbstractIterator<T>, filterExpr: string) {
        super();
        let compColl: Array<T>;
        if (comparables instanceof AbstractIterator) {
            compColl = Helpers.enumerate(<AbstractIterator<T>>comparables)
        } else {
            compColl = <Array<T>>comparables;
        }
        this._comparables = compColl.slice().filter(c => {
            if (filterExpr.replace(" ", "") == "") {
                return true;
            }
            try {
                //noinspection JSUnusedLocalSymbols
                let V = c.compareCriteria;
                return <boolean>eval(filterExpr);
            } catch (e) {
                return true;
            }
        });
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