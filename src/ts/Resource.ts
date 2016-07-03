//Конкретный ресурс, который хранится на складе
class Resource {
    //Свойства данного ресурса
    private _description:ResourceDescription;
    //Качество ресурса. Может ухудшаться от плохих факторов
    private _quality:number;
    //Деньги, которые получит кладовщик за хранение ресурса
    private _rent:number;
    //Оставшееся время хранения ресурса
    private _storeDays:number;


    //Возвращает свойства ресурса
    get description():ResourceDescription {
        return this._description;
    }

    //Возвращает качество ресурса
    get quality():number {
        return this._quality;
    }

    //Возвращает количество денег за аренду
    get rent():number {
        return this._rent;
    }

    //Возвращает оставшееся время хранения ресурса
    get storeDays():number {
        return this._storeDays;
    }

    //Устанавливает оставшееся время хранения ресурса
    set storeDays(value:number) {
        this._storeDays = value;
    }

    //Устанавливает качество ресурса
    set quality(value) {
        this._quality = value;
    }
}