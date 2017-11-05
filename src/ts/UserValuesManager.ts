//Общий класс для тех вещей которые пользователь добавляет/изменяет/удаляет
import {SortIterator} from "./SortIterator";
import {Helpers} from "./Helpers";
import {AbstractIterator} from "./AbstractIterator";
import {InverseIterator} from "./InverseIterator";
import {FilterIterator} from "./FilterIterator";
import {TemplateFactory} from "./TemplateFactory";

export abstract class UserValuesManager {
    //окно с формой для добавления/изменения сущности
    protected _modal: JQuery;
    //сама форма
    protected _form: JQuery;
    //список на страничке
    protected _list: JQuery;
    //индекс обновляемого элемента
    protected _updateIndex: number = -1;
    //список в памяти
    protected _entities: Array<any> = [];
    //элемент мультивыбора
    protected _multiSelect: JQuery = null;
    //объекты для мультивыбора
    protected _multiObjects: Array<any> = null;
    //создание нужного итератора
    protected _iteratorFactory: () => AbstractIterator<any> = () => new SortIterator(this._entities);

    constructor(multiObjects?: Array<any>) {
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
        this._list = $(this.getListId());
        this.renderList();

        if (multiObjects) {
            this._multiObjects = multiObjects;
            this._multiSelect = this._form.find('[name="multi"]');
            this._multiSelect.multiSelect();
            this.updateMultiList();
        }

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

        $(document).on('click', this.getSortUpId(), function () {
            self._iteratorFactory = () => new SortIterator(self._entities);
            $(self.getSortDownId()).removeClass("btn-success");
            $(self.getSortDownId()).addClass("btn-danger");
            $(self.getSortUpId()).removeClass("btn-danger");
            $(self.getSortUpId()).addClass("btn-success");
            self.renderList();
        });

        $(document).on('click', this.getSortDownId(), function () {
            self._iteratorFactory = () => new InverseIterator(new SortIterator(self._entities));
            $(self.getSortUpId()).removeClass("btn-success");
            $(self.getSortUpId()).addClass("btn-danger");
            $(self.getSortDownId()).removeClass("btn-danger");
            $(self.getSortDownId()).addClass("btn-success");
            self.renderList();
        });

        $(document).on('keyup', this.getFilterId(), function () {
            self.renderList();
        });
    }

    //получение имени сущности
    protected abstract getEntityName(): string;

    //создание сущности
    protected abstract createEntity(formData: any): any;

    //установить значения формы
    protected abstract setFormValues(entity: any): void;

    //ширина формы
    protected abstract getFormWidth(): number;

    //высота формы
    protected abstract getFormHeight(): number;

    //получить сущности для множественного выбора
    protected abstract getMultiObjects(entity: any): Array<any>;

    //получить id шаблона сущности
    protected getListTemplateName(): string {
        return `${this.getEntityName()}-list`;
    }

    //получить id списка сущности
    protected getListId(): string {
        return `#${this.getEntityName()}-list`;
    }

    //получить id формы сущности
    protected getFormId(): string {
        return `#${this.getEntityName()}-form`;
    }

    //получить id кнопки создания сущности
    protected getCreateBtnId(): string {
        return `#create-${this.getEntityName()}`;
    }

    //получить id кнопки сортировки по возрастанию
    protected getSortUpId(): string {
        return `#${this.getEntityName()}-sort-up`;
    }

    //получить id кнопки сортировки по убыванию
    protected getSortDownId(): string {
        return `#${this.getEntityName()}-sort-down`;
    }

    //получить id поля фильтра
    protected getFilterId(): string {
        return `#${this.getEntityName()}-filter`;
    }

    //получить class кнопки удаления сущности
    protected getDeleteBtnClass(): string {
        return `.delete-${this.getEntityName()}`;
    }

    //получить class кнопки обновления сущности
    protected getUpdateBtnClass(): string {
        return `.update-${this.getEntityName()}`;
    }

    //получить выбранные сущности из формы
    protected getMultiSelectedObjects(formData: any): Array<any> {
        let multiIdicies = formData.multi;
        let multiArray: Array<any> = [];
        if (multiIdicies) {
            for (let index of multiIdicies) {
                multiArray.push(this._multiObjects[index]);
            }
        }
        return multiArray;
    }

    //обновить список сущностей
    protected updateMultiList(): void {
        if (this._multiObjects) {
            this._multiSelect.empty();
            let i = 0;
            for (let object of this._multiObjects) {
                this._multiSelect.append(
                    '<option value="' + i + '">' +
                    object.name +
                    '</option>');
                ++i;
            }
            this._multiSelect.multiSelect('refresh');
        }
    }

    //установить выбранные сущности на форме
    protected setMultiSelect(entity: any): void {
        if (this._multiObjects) {
            let multiIdicies: Array<string> = [];
            for (let multi of this.getMultiObjects(entity)) {
                multiIdicies.push(this._multiObjects.indexOf(multi).toString());
            }
            setTimeout(() => {
                this._multiSelect.multiSelect('select', multiIdicies);
            }, 0);
        }
    }

    //показать форму редактирования
    protected openForm(): void {
        this.updateMultiList();
        this._modal.dialog('open');
        this._modal.dialog('option', 'position',
            {my: "top top", at: "top top", of: window}
        );
    }

    //закрыть форму редактирования
    protected closeForm(): void {
        this._modal.dialog('close');
    }

    //получить данные формы редактирования
    protected formData(): any {
        return this._form.serializeArray().reduce((obj: any, item: any) => {
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

    //сохранить форму редактирования в сущность
    protected saveForm(): void {
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

    //удалить сущность
    protected deleteEntity(index: number): void {
        this._entities.splice(index, 1);
        this.renderList();
    }

    //обновить сущность
    protected updateEntity(index: number): void {
        this._updateIndex = index;
        let updatingEntity = this._entities[index];
        this.updateMultiList();
        this.setFormValues(updatingEntity);
        this.setMultiSelect(updatingEntity);
        this.openForm();
    }

    //отобразить список сущностей
    protected renderList() {
        let context: any = {};
        this._entities.forEach((e, i) => e.idx = i);
        context[this.getEntityName()] = Helpers.enumerate(new FilterIterator(this._iteratorFactory(), $(this.getFilterId()).val()));
        this._list.html(TemplateFactory.getTemplate(this.getListTemplateName()).getHtml(context));
    }
}
