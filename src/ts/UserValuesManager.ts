//Общий класс для тех вещей которые пользователь добавляет/изменяет/удаляет
export abstract class UserValuesManager {
    //окно с формой для добавления/изменения ресурса
    protected _modal:JQuery;
    //сама форма
    protected _form:JQuery;
    //шаблон элемента списка
    protected _listTemplate:HandlebarsTemplateDelegate;
    //список на страничке
    protected _list:JQuery;
    //индекс обновляемого элемента
    protected _updateIndex:number = -1;
    //список в памяти
    protected _entities:Array<any> = [];


    constructor() {
        this._modal = $(this.getFormId()).dialog({
            autoOpen: false,
            height: this.getFormHeight(),
            width: this.getFormWidth(),
            modal: true,
            buttons: {
                'Применить': () => {
                    this.saveForm();
                    this.closeForm();
                },
                'Отмена': () => {
                    this.closeForm();
                }
            },
            close: () => {
                (this._form.get(0) as HTMLFormElement).reset();
            }
        });
        this._form = this._modal.find('form');
        this._listTemplate = Handlebars.compile($(this.getTemplateId()).html());
        this._list = $(this.getListId());
        this.renderList();

        $(this.getCreateBtnId()).click(() => {
            this.openForm();
        });

        let self = this;
        $(document).on('click', this.getDeleteBtnClass(), function () {
            self.deleteEntity(+$(this).parent().attr('data-idx'));
        });
        $(document).on('click', this.getUpdateBtnClass(), function () {
            self.updateEntity(+$(this).parent().attr('data-idx'));
        });
    }

    protected abstract getEntityName():string;

    protected abstract createEntity(formData:any):any;

    protected abstract setFormValues(entity:any):void;

    protected abstract getFormWidth():number;

    protected abstract getFormHeight():number;

    protected getTemplateId():string {
        return `#${this.getEntityName()}-template`;
    }

    protected getListId():string {
        return `#${this.getEntityName()}-list`;
    }

    protected getFormId():string {
        return `#${this.getEntityName()}-form`;
    }

    protected getCreateBtnId():string {
        return `#create-${this.getEntityName()}`;
    }

    protected getDeleteBtnClass():string {
        return `.delete-${this.getEntityName()}`;
    }

    protected getUpdateBtnClass():string {
        return `.update-${this.getEntityName()}`;
    }

    protected openForm() {
        this._modal.dialog('open');
    }

    protected closeForm() {
        this._modal.dialog('close');
    }

    protected formData():any {
        return this._form.serializeArray().reduce((obj:any, item:any) => {
            if (obj[item.name]) {
                if (Array.isArray(obj[item.name])) {
                    obj[item.name].push(item.value);
                } else {
                    obj[item.name] = [obj[item.name], item.value];
                }
            } else {
                obj[item.name] = item.value;
            }
            return obj;
        }, {});
    }

    protected saveForm():void {
        let data = this.formData();
        let entity = this.createEntity(data);

        if (this._updateIndex < 0) {
            this._entities.push(entity);
        } else {
            this._entities[this._updateIndex] = entity;
        }
        this._updateIndex = -1;
        this.renderList();
    }

    protected deleteEntity(index:number):void {
        this._entities.splice(index, 1);
        this.renderList();
    }

    protected updateEntity(index:number):void {
        this._updateIndex = index;
        let updatingEntity = this._entities[index];
        this.setFormValues(updatingEntity);
        this.openForm();
    }

    protected renderList() {
        let context:any = {};
        context[this.getEntityName()] = this._entities;
        this._list.html(this._listTemplate(context));
    }
}
