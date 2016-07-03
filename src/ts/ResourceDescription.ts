//Описание свойств ресурса
class ResourceDescription {
    //Название ресурса
    private _name:string;
    //Сухой ресурс или нет
    private _dry:boolean;
    //Горючий ли ресурс
    private _ignitable:boolean;
    //Съедобный ли ресурс
    private _eatable:boolean;
    //Был ли данный ресурс живым
    private _natural:boolean;


    //Возращает название ресурса
    get name():string {
        return this._name;
    }

    //Возращает флаг сухости
    get dry():boolean {
        return this._dry;
    }

    //Возращает флаг горючести
    get ignitable():boolean {
        return this._ignitable;
    }

    //Возращает флаг съедобности
    get eatable():boolean {
        return this._eatable;
    }

    //Возращает флаг живости
    get natural():boolean {
        return this._natural;
    }
}