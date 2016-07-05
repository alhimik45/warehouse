import {UserValuesManager} from "./UserValuesManager";
import {BadFactorDescription} from "./BadFactorDescription";
import {ResourceDescription} from "./ResourceDescription";

//Управление списком плохих факторов
export class BadFactorManager extends UserValuesManager {
    //элемент выбора ресурса на который влияет фактор
    private _resourcesSelect:JQuery;
    //ресурсы для выбора
    private _resources:Array<ResourceDescription>;

    constructor(resources:Array<ResourceDescription>) {
        super();
        this._resources = resources;
        this._resourcesSelect = this._form.find('[name="resources"]');
        this._resourcesSelect.multiSelect();
        this.updateResourcesList();
    }

    private updateResourcesList() {
        this._resourcesSelect.empty();
        let i = 0;
        for (let resource of this._resources) {
            this._resourcesSelect.append(
                '<option value="' + i + '">' +
                resource.name +
                '</option>');
            ++i;
        }
        this._resourcesSelect.multiSelect('refresh');
    }

    protected openForm() {
        this.updateResourcesList();
        super.openForm();
    }

    protected getEntityName():string {
        return 'bad-factor';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 550;
    }

    protected createEntity(formData:any):any {
        let resourceIdicies = formData.resources;
        let resourceArray:Array<ResourceDescription> = [];
        if (resourceIdicies) {
            for (let index of resourceIdicies) {
                resourceArray.push(this._resources[index]);
            }
        }
        return new BadFactorDescription(
            formData.name,
            formData.damage || 1,
            resourceArray);
    }

    protected setFormValues(badFactor:BadFactorDescription):void {
        this._form.find('[name="name"]').val(badFactor.name);
        this._form.find('[name="damage"]').val(badFactor.qualityDamage);
        this.updateResourcesList();
        let resourceIdicies:Array<string> = [];
        for (let resource of badFactor.affectedResources) {
            resourceIdicies.push(this._resources.indexOf(resource).toString());
        }
        setTimeout(()=> {
            this._resourcesSelect.multiSelect('select', resourceIdicies);
        }, 0);//¯\_(ツ)_/¯
    }

    get badFactors():Array<BadFactorDescription> {
        return this._entities;
    }
}
