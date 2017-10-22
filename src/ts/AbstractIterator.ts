import {IComparable} from "./IComparable";

export abstract class AbstractIterator<T extends IComparable> {
    public abstract current(): T;

    public abstract moveNext(): boolean;

    public abstract reset(): void;
}