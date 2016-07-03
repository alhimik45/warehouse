//Плохой фактор
class BadFactor {
    //Свойства данного фактора
    private _description:BadFactorDescription;
    //Количество очков "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса
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

    //Возвращает количество "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса
    get hitPoints():number {
        return this._hitPoints;
    }

    //Устанавливает очки "жизней"
    set hitPoints(value:number) {
        this._hitPoints = value;
    }
}
