import {ResourceDescription} from "./ResourceDescription";
import {Resource} from "./Resource";
import {IComparable} from "./IComparable";

//Описание плохого фактора
export class BadFactorDescription implements IComparable {
    //Название фактора
    private _name: string;
    //Насколько портит данный фактор качество ресурса
    private _damage: number;
    //Ресурсы, на которые может влиять фактор
    private _affectedResources: Array<ResourceDescription>;
    //Количество очков "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса
    private _hitPoints: number;

    constructor(name: string, qualityDamage: number, hitPoints: number, affectedResources: Array<ResourceDescription>) {
        this._name = name;
        this._damage = qualityDamage;
        this._hitPoints = hitPoints;
        this._affectedResources = affectedResources;
    }

    //Проверка, может ли данный фактор влиять на определённый ресурс.
    public canAffectTo(resource: Resource): boolean {
        let checkedResourceDescription = resource.description;
        for (let resource of this._affectedResources) {
            //на ресурс можно повлиять если он указан в списке влияния
            if (resource === checkedResourceDescription) {
                return true;
            }
        }
    }

    //Повлиять на ресурс.
    public affect(resource: Resource): void {
        resource.quality -= this._damage;
    }


    // Возвращает название плохого фактора
    get name(): string {
        return this._name;
    }

    //Возвращает урон наносимый ресурсам
    get damage(): number {
        return this._damage;
    }

    //Возвращает количество "жизней" фактора
    get hitPoints(): number {
        return this._hitPoints;
    }

    //Возвращает ресурсы, на которые влияет фактор
    get affectedResources(): Array<ResourceDescription> {
        return this._affectedResources;
    }

    //Возвращает критерий сравнения
    get compareCriteria(): number {
        return this.hitPoints * this.damage;
    }
}