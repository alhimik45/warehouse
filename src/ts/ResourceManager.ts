import {ResourceDescription} from "./ResourceDescription";
import {UserValuesManager} from "./UserValuesManager";

//Управление списком ресурсов
export class ResourceManager extends UserValuesManager {

    constructor(){
        super();
        this._entities.push(new ResourceDescription('Сено', true, true, false));
        this.renderList();
    }

    protected getEntityName():string {
        return 'resource';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 300;
    }

    protected createEntity(formData:any):any {
        return new ResourceDescription(
            formData.name,
            !!formData.dry,
            !!formData.ignitable,
            !!formData.eatable);
    }

    protected setFormValues(resource:ResourceDescription):void {
        this._form.find('[name="name"]').val(resource.name);
        this._form.find('[name="dry"]').prop('checked', resource.dry);
        this._form.find('[name="eatable"]').prop('checked', resource.eatable);
        this._form.find('[name="ignitable"]').prop('checked', resource.ignitable);
    }

    get resources():Array<ResourceDescription> {
        return this._entities;
    }
}
