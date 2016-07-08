import {ResourceDescription} from "./ResourceDescription";
import {UserValuesManager} from "./UserValuesManager";

//Управление списком ресурсов
export class ResourceManager extends UserValuesManager {

    constructor() {
        super();

        this._entities.push(new ResourceDescription('Сено', 100, 100, '/img/seno.jpg'));
        this._entities.push(new ResourceDescription('Мыло', 130, 70, '/img/mylo.jpg'));
        this._entities.push(new ResourceDescription('Хлеб', 30, 130, '/img/hleb.jpg'));
        this._entities.push(new ResourceDescription('Вода', 20, 100, '/img/voda.jpg'));
        this._entities.push(new ResourceDescription('Бензин', 10, 200, '/img/benzin.png'));
        this._entities.push(new ResourceDescription('Сало', 50, 300, '/img/salo.jpg'));
        this._entities.push(new ResourceDescription('Бетон', 120, 60, '/img/beton.png'));
        this._entities.push(new ResourceDescription('Кирпич', 120, 30, '/img/kirpitch.jpg'));
        this._entities.push(new ResourceDescription('Сахар', 30, 140, '/img/sahar.jpg'));
        this._entities.push(new ResourceDescription('Порох', 10, 160, '/img/poroh.png'));

        this.renderList();
    }

    protected getEntityName():string {
        return 'resource';
    }

    protected getFormWidth():number {
        return 450;
    }

    protected getFormHeight():number {
        return 500;
    }

    protected getMultiObjects(resource:ResourceDescription):Array<any> {
        return [];
    }

    protected createEntity(formData:any):any {
        return new ResourceDescription(
            formData.name,
            formData.quality || 100,
            formData.rent || 100,
            formData.image || null);
    }

    protected setFormValues(resource:ResourceDescription):void {
        this._form.find('[name="name"]').val(resource.name);
        this._form.find('[name="quality"]').val(resource.quality);
        this._form.find('[name="rent"]').val(resource.rent);
        this._form.find('[name="image"]').val(resource.image);
    }

    get resources():Array<ResourceDescription> {
        return this._entities;
    }
}
