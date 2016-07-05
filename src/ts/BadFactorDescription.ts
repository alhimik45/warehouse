import {ResourceDescription} from "./ResourceDescription";
import {Resource} from "./Resource";

//Описание плохого фактора
export class BadFactorDescription {
    //Название фактора
    private _name:string;
    //Насколько портит данный фактор качество ресурса
    private _qualityDamage:number;
    //Ресурсы, на которые может влиять фактор
    private _affectedResources:Array<ResourceDescription>;


    constructor(name:string, qualityDamage:number, affectedResources:Array<ResourceDescription>) {
        this._name = name;
        this._qualityDamage = qualityDamage;
        this._affectedResources = affectedResources;
    }

    //Проверка, может ли данный фактор влиять на определённый ресурс.
    public canAffectTo(resource:Resource):boolean {
        let checkedResourceDescription = resource.description;
        for (let resource of this._affectedResources) {
            //на ресурс можно повлиять если он конкретно указан по имени в списке влияния
            if (resource.name === checkedResourceDescription.name) {
                return true;
                //или если его свойства совпадают в теми, которые указаны в списке
            } else if (resource.dry === checkedResourceDescription.dry &&
                resource.eatable === checkedResourceDescription.eatable &&
                resource.ignitable === checkedResourceDescription.ignitable) {
                return true;
            }
        }
    }

    //Повлиять на ресурс.
    public affect(resource:Resource):void {
        resource.quality -= this._qualityDamage;
    }


    // Возвращает название плохого фактора
    get name():string {
        return this._name;
    }

    //Возвращает урон наносимый ресурсам
    get qualityDamage():number {
        return this._qualityDamage;
    }

    //Возвращает ресурсы, на которые влияет фактор
    get affectedResources():Array<ResourceDescription> {
        return this._affectedResources;
    }
}