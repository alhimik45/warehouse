import {BadFactor} from "./BadFactor";
import {Resource} from "./Resource";

//Одно место на складе
export class Cell {
    //Нечто плохое, влияющее на находящийся тут ресурс
    private _badFactor: BadFactor = null;
    //Ресурс, хранящийся в данном месте склада
    private _resource: Resource;
    //Оставшееся время хранения ресурса
    private _restStoreDays: number;
    //Время хранения ресурса
    private _storeDays: number;


    constructor(resource: Resource, storeDays: number) {
        this._resource = resource;
        this._storeDays = storeDays;
        this._restStoreDays = storeDays;
    }

    //Возвращает плохой фактор
    get badFactor(): BadFactor {
        return this._badFactor;
    }

    //Возвращает описание ресурса
    get resource(): Resource {
        return this._resource;
    }

    //Возвращает оставшееся время хранения ресурса
    get storeDays(): number {
        return this._storeDays;
    }

    //Возвращает оставшееся время хранения ресурса
    get restStoreDays(): number {
        return this._restStoreDays;
    }

    //Устанавливает оставшееся время хранения ресурса
    set restStoreDays(value: number) {
        this._restStoreDays = value;
    }

    //Устанавливает плохой фактор
    set badFactor(value: BadFactor) {
        this._badFactor = value;
    }
}