//Склад
class Warehouse {
    //Максимальное количество мест на складе
    private _capacity:number;
    //Занятые места на складе
    private _cells:Array<Cell>;
    //Стоимость увеличения вместимости склада на одно место
    private _cellCost:number;


    //Возвращает массив занятых ячеек склада
    get cells():Array<Cell> {
        return this._cells;
    }

    //Возвращает стоимость увеличения вместимости склада на одно место
    get cellCost():number {
        return this._cellCost;
    }

    //Возвращает максимальное количество мест на складе
    get capacity():number {
        return this._capacity;
    }

    //Устанавливает максимальное количество мест на складе
    set capacity(value:number) {
        this._capacity = value;
    }
}