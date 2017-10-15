import {BadFactorDescription} from "./BadFactorDescription";
import {IResourceApplicator} from "./IResourceApplicator";
import {Cell} from "./Cell";

//Плохой фактор
export class BadFactor implements IResourceApplicator {
    //Свойства данного фактора
    private _description:BadFactorDescription;
    //Текущее количество жизней фактора
    private _hitPoints:number;


    constructor(description:BadFactorDescription) {
        this._description = description;
        this._hitPoints = description.hitPoints;
    }

    //Проверка, может ли данный фактор влиять на определённый ресурс. Делегируется свойствам ресурса
    public canApply(cell:Cell):boolean {
        return this._description.canAffectTo(cell.resource);
    }

    //Повлиять на ресурс. Делегируется свойствам ресурса
    public apply(cell:Cell):void {
        this._description.affect(cell.resource);
    }


    //Возвращает свойства фактора
    get description():BadFactorDescription {
        return this._description;
    }

    //Возвращает количество "жизней" фактора
    get hitPoints():number {
        return this._hitPoints;
    }

    //Устанавливает очки "жизней"
    set hitPoints(value:number) {
        this._hitPoints = value;
    }
}
