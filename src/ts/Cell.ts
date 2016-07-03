//Одно место на складе
class Cell {
    //Нечто плохое, влияющее на находящийся тут ресурс
    private _badFactor:BadFactor;
    //Ресурс, хранящийся в данном месте склада
    private _resource:Resource;


    //Возвращает плохой фактор
    get badFactor():BadFactor {
        return this._badFactor;
    }

    //Возвращает описание ресурса
    get resource():Resource {
        return this._resource;
    }

    //Устанавливает плохой фактор
    set badFactor(value:BadFactor) {
        this._badFactor = value;
    }
}