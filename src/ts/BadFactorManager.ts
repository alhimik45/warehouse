import {UserValuesManager} from "./UserValuesManager";
import {BadFactorDescription} from "./BadFactorDescription";
import {ResourceDescription} from "./ResourceDescription";
import {selectIndexes} from "./util";



//Управление списком плохих факторов
export class BadFactorManager extends UserValuesManager {


    constructor(resources:Array<ResourceDescription>) {
        super(resources);

        this._entities.push(new BadFactorDescription('Крысы', 15, 50,
            selectIndexes(resources, [0, 1, 2, 5, 8])
        ));
        this._entities.push(new BadFactorDescription('Тараканы', 5, 80,
            selectIndexes(resources, [2, 3, 5, 6, 7, 8])
        ));
        this._entities.push(new BadFactorDescription('Пожар', 30, 20,
            selectIndexes(resources, [0, 2, 4, 5, 8, 9])
        ));
        this._entities.push(new BadFactorDescription('Затопление', 20, 50,
            selectIndexes(resources, [0, 1, 2, 8, 9])
        ));

        this.renderList();
    }

    protected getEntityName():string {
        return 'bad-factor';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 650;
    }

    protected getMultiObjects(badFactor:BadFactorDescription):Array<ResourceDescription> {
        return badFactor.affectedResources;
    }

    protected createEntity(formData:any):any {
        let resourceArray = this.getMultiSelectedObjects(formData);
        return new BadFactorDescription(
            formData.name,
            formData.damage || 1,
            formData.hitpoints || 50,
            resourceArray);
    }

    protected setFormValues(badFactor:BadFactorDescription):void {
        this._form.find('[name="name"]').val(badFactor.name);
        this._form.find('[name="damage"]').val(badFactor.qualityDamage);
        this._form.find('[name="hitpoints"]').val(badFactor.hitPoints);
    }

    get badFactors():Array<BadFactorDescription> {
        return this._entities;
    }
}
