import {BadFactorDescription} from "./BadFactorDescription";
import {Cell} from "./Cell";
import {IProtector} from "./IProtector";

//Декоратор, добавляющий защитному средству максимальное количество использований
export class ProtectorLimiter implements IProtector {
    private _originalProtector: IProtector;
    private _limit: number;

    constructor(originalProtector: IProtector, limit: number) {
        this._originalProtector = originalProtector;
        this._limit = limit;
    }

    public canApply(cell: Cell): boolean {
        return this._limit > 0 && this._originalProtector.canApply(cell);
    }

    public apply(cell: Cell) {
        if (this.canApply(cell)) {
            this._limit -= 1;
            this._originalProtector.apply(cell);
        }
    }

    get cost(): number {
        return this._originalProtector.cost;
    }

    get damage(): number {
        return this._originalProtector.damage;
    }

    get name(): string {
        return this._originalProtector.name;
    }

    get goodAgainst(): Array<BadFactorDescription> {
        return this._originalProtector.goodAgainst;
    }

    get compareCriteria(): number {
        return this._originalProtector.compareCriteria;
    }
}