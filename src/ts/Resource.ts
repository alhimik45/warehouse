import {ResourceDescription} from "./ResourceDescription";

//Конкретный ресурс, который хранится на складе
export class Resource {
    //Свойства данного ресурса
    private _description:ResourceDescription;
    //Качество ресурса. Может ухудшаться от плохих факторов
    private _quality:number;


    constructor(description:ResourceDescription) {
        this._description = description;
        this._quality = description.quality;
    }

    //Возвращает свойства ресурса
    get description():ResourceDescription {
        return this._description;
    }

    //Возвращает качество ресурса
    get quality():number {
        return this._quality;
    }

    //Устанавливает качество ресурса
    set quality(value) {
        this._quality = value;
    }
}