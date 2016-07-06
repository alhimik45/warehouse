import {UserValuesManager} from "./UserValuesManager";
import {BadFactorDescription} from "./BadFactorDescription";
import {ResourceDescription} from "./ResourceDescription";

//Управление списком плохих факторов
export class BadFactorManager extends UserValuesManager {

    protected getEntityName():string {
        return 'bad-factor';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 550;
    }

    protected getMultiObjects(badFactor: BadFactorDescription): Array<ResourceDescription>{
        return badFactor.affectedResources;
    }

    protected createEntity(formData:any):any {
        let resourceArray = this.getMultiSelectedObjects(formData);
        return new BadFactorDescription(
            formData.name,
            formData.damage || 1,
            resourceArray);
    }

    protected setFormValues(badFactor:BadFactorDescription):void {
        this._form.find('[name="name"]').val(badFactor.name);
        this._form.find('[name="damage"]').val(badFactor.qualityDamage);
    }

    get badFactors():Array<BadFactorDescription> {
        return this._entities;
    }
}
