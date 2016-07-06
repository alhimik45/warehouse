//Описание свойств ресурса
export class ResourceDescription {
    //Название ресурса
    private _name:string;
    //Изначальное качество ресурса. Принимается за 100%
    private _quality:number;
    //Деньги за один день хранения ресурса
    private _rent:number;


    constructor(name:string, quality:number, rent:number) {
        this._name = name;
        this._quality = quality;
        this._rent = rent;
    }

    //Возращает название ресурса
    get name():string {
        return this._name;
    }

    //Возвращает качество ресурса
    get quality():number {
        return this._quality;
    }

    //Возвращает количество денег за аренду
    get rent():number {
        return this._rent;
    }
}