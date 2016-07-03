//Средство защиты от плохого фактора
class Protector {
    //Массив плохих факторов, против которых данное средство будет работать
    private _goodAgainst:Array<BadFactorDescription>;

    //Стоимость средства
    private _cost:number;


    constructor(goodAgainst:Array<BadFactorDescription>, cost:number) {
        this._goodAgainst = goodAgainst;
        this._cost = cost;
    }

    //Проверка, может ли данное средство справиться с определённым фактором
    public сanProtectFrom(badFactor:BadFactor):boolean {
        return this._goodAgainst.indexOf(badFactor.description) !== -1;
    }

    //Возвращает стоимость средства
    get cost():number {
        return this._cost;
    }
}