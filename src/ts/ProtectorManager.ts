import {UserValuesManager} from "./UserValuesManager";
import {Protector} from "./Protector";
import {BadFactorDescription} from "./BadFactorDescription";

//Управление списком плохих факторов
export class ProtectorManager extends UserValuesManager {

    protected getEntityName():string {
        return 'protector';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 550;
    }

    protected getMultiObjects(protector: Protector): Array<BadFactorDescription>{
        return protector.goodAgainst;
    }

    protected createEntity(formData:any):any {
        let badFactorArray = this.getMultiSelectedObjects(formData);
        return new Protector(
            formData.name,
            formData.cost || 1,
            badFactorArray);
    }

    protected setFormValues(protector:Protector):void {
        this._form.find('[name="name"]').val(protector.name);
        this._form.find('[name="cost"]').val(protector.cost);
    }

    get protectors():Array<Protector> {
        return this._entities;
    }
}
