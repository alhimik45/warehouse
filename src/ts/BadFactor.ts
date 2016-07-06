import {BadFactorDescription} from "./BadFactorDescription";
import {Resource} from "./Resource";

//Плохой фактор
export class BadFactor {
    //Свойства данного фактора
    private _description:BadFactorDescription;
    //Текущее количество жизней фактора
    private _hitPoints:number;


    //Проверка, может ли данный фактор влиять на определённый ресурс. Делегируется свойствам ресурса
    public canAffectTo(resource:Resource):boolean {
        return this._description.canAffectTo(resource);
    }

    //Повлиять на ресурс. Делегируется свойствам ресурса
    public affect(resource:Resource):void {
        this._description.affect(resource);
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
