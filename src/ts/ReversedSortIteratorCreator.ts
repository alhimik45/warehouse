import {IteratorCreator} from "./IteratorCreator";
import {SortIterator} from "./SortIterator";
import {InverseIterator} from "./InverseIterator";
import {AbstractIterator} from "./AbstractIterator";

export class ReversedSortIteratorCreator implements IteratorCreator {
    private _objects: Array<any>;

    constructor(objects: Array<any>) {
        this._objects = objects;
    }

    createIterator(): AbstractIterator<any> {
        return new InverseIterator(new SortIterator(this._objects));
    }
}