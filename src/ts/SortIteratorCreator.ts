import {IteratorCreator} from "./IteratorCreator";
import {SortIterator} from "./SortIterator";
import {AbstractIterator} from "./AbstractIterator";

export class SortIteratorCreator implements IteratorCreator {
    private _objects: Array<any>;

    constructor(objects: Array<any>) {
        this._objects = objects;
    }

    createIterator(): AbstractIterator<any> {
        return new SortIterator(this._objects);
    }
}