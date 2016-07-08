//Описание свойств ресурса
export class ResourceDescription {
    //Название ресурса
    private _name:string;
    //Изначальное качество ресурса. Принимается за 100%
    private _quality:number;
    //Деньги за один день хранения ресурса
    private _rent:number;
    //изображение
    private _imageUrl: string = null;



    constructor(name:string, quality:number, rent:number, image?:string) {
        this._name = name;
        this._quality = quality;
        this._rent = rent;
        if(image){
            this._imageUrl = image;
        }
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

    //Возвращает url изображения
    get image():string {
        return this._imageUrl;
    }
}