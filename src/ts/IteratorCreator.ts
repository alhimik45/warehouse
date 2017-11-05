import {AbstractIterator} from "./AbstractIterator";

export interface IteratorCreator {
    createIterator(): AbstractIterator<any>;
}