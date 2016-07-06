import {selectIndexes} from "./util";
import {BadFactorDescription} from "./BadFactorDescription";
import {UserValuesManager} from "./UserValuesManager";
import {Protector} from "./Protector";


//Управление списком плохих факторов
export class ProtectorManager extends UserValuesManager {

    constructor(badFactors:Array<BadFactorDescription>) {
        super(badFactors);

        this._entities.push(new Protector('Отрава', 50, 20,
            selectIndexes(badFactors, [0, 1])
        ));
        this._entities.push(new Protector('Инсектициды', 25, 45,
            selectIndexes(badFactors, [1])
        ));
        this._entities.push(new Protector('Вода', 30, 20,
            selectIndexes(badFactors, [0, 2])
        ));
        this._entities.push(new Protector('Огнетушитель', 60, 50,
            selectIndexes(badFactors, [2])
        ));
        this._entities.push(new Protector('Силикагель', 150, 50,
            selectIndexes(badFactors, [0, 1, 3])
        ));
        this._entities.push(new Protector('Влагопоглотитель', 50, 40,
            selectIndexes(badFactors, [3])
        ));

        this.renderList();
    }

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
            formData.damage || 10,
            badFactorArray);
    }

    protected setFormValues(protector:Protector):void {
        this._form.find('[name="name"]').val(protector.name);
        this._form.find('[name="cost"]').val(protector.cost);
        this._form.find('[name="damage"]').val(protector.damage);
    }

    get protectors():Array<Protector> {
        return this._entities;
    }
}
