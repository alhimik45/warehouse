import {BadFactorDescription} from "./BadFactorDescription";
import {BadFactor} from "./BadFactor";

//Средство защиты от плохого фактора
export class Protector {
    //Название средства
    private _name:string;
    //Массив плохих факторов, против которых данное средство будет работать
    private _goodAgainst:Array<BadFactorDescription>;
    //Стоимость средства
    private _cost:number;


    constructor(name:string, cost:number, goodAgainst:Array<BadFactorDescription>) {
        this._name = name;
        this._cost = cost;
        this._goodAgainst = goodAgainst;
    }

    //Проверка, может ли данное средство справиться с определённым фактором
    public сanProtectFrom(badFactor:BadFactor):boolean {
        return this._goodAgainst.indexOf(badFactor.description) !== -1;
    }

    //Возвращает стоимость средства
    get cost():number {
        return this._cost;
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