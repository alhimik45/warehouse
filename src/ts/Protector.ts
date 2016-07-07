import {BadFactorDescription} from "./BadFactorDescription";
import {BadFactor} from "./BadFactor";
import {Cell} from "./Cell";

//Средство защиты от плохого фактора
export class Protector {
    //Название средства
    private _name:string;
    //Массив плохих факторов, против которых данное средство будет работать
    private _goodAgainst:Array<BadFactorDescription>;
    //Стоимость средства
    private _cost:number;
    //Урон, который средство наносит плохому фактору
    private _damage:number;


    constructor(name:string, cost:number, damage:number, goodAgainst:Array<BadFactorDescription>) {
        this._name = name;
        this._cost = cost;
        this._damage = damage;
        this._goodAgainst = goodAgainst;
    }

    //Проверка, может ли данное средство справиться с определённым фактором
    public сanProtectFrom(badFactor:BadFactor):boolean {
        return this._goodAgainst.indexOf(badFactor.description) !== -1;
    }

    //Защита от фактора
    public protect(cell:Cell) {
        if (this.сanProtectFrom(cell.badFactor)) {
            cell.badFactor.hitPoints -= this._damage;
            if (cell.badFactor.hitPoints <= 0) {
                cell.badFactor = null;
            }
        }
    }

    //Возвращает стоимость средства
    get cost():number {
        return this._cost;
    }

    //Возвращает урон плохому фактору
    get damage():number {
        return this._damage;
    }

    //Возвращает название средства
    get name():string {
        return this._name;
    }

    //Возвращает плохие факторы, против которых данное средство работет
    get goodAgainst():Array<BadFactorDescription> {
        return this._goodAgainst;
    }
}