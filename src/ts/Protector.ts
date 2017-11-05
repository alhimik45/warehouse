import {BadFactorDescription} from "./BadFactorDescription";
import {Cell} from "./Cell";
import {IProtector} from "./IProtector";

//Средство защиты от плохого фактора
export class Protector implements IProtector {
    //Название средства
    private _name: string;
    //Массив плохих факторов, против которых данное средство будет работать
    private _goodAgainst: Array<BadFactorDescription>;
    //Стоимость средства
    private _cost: number;
    //Урон, который средство наносит плохому фактору
    private _damage: number;


    constructor(name: string, cost: number, damage: number, goodAgainst: Array<BadFactorDescription>) {
        this._name = name;
        this._cost = cost;
        this._damage = damage;
        this._goodAgainst = goodAgainst;
    }

    //Проверка, может ли данное средство справиться с определённым фактором
    public canApply(cell: Cell): boolean {
        return this._goodAgainst.indexOf(cell.badFactor.description) !== -1;
    }

    //Защита от фактора
    public apply(cell: Cell) {
        if (this.canApply(cell)) {
            cell.badFactor.hitPoints -= this._damage;
            if (cell.badFactor.hitPoints <= 0) {
                cell.badFactor = null;
            }
        }
    }

    //Возвращает стоимость средства
    get cost(): number {
        return this._cost;
    }

    //Возвращает урон плохому фактору
    get damage(): number {
        return this._damage;
    }

    //Возвращает название средства
    get name(): string {
        return this._name;
    }

    //Возвращает плохие факторы, против которых данное средство работет
    get goodAgainst(): Array<BadFactorDescription> {
        return this._goodAgainst;
    }

    //Возвращает критерий сравнения
    get compareCriteria(): number {
        return this.damage / this.cost;
    }
}