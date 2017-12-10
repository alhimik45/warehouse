import {Cell} from "./Cell";
import {BadFactorDescription} from "./BadFactorDescription";
import {BadFactor} from "./BadFactor";
import {ResourceDescription} from "./ResourceDescription";
import {ResourcePool} from "./ResourcePool";
import {CellType} from "./CellType";
import {CellBuilder} from "./CellBuilder";
import {Subject} from "./Subject";

//Склад
export class Warehouse extends Subject {
    //Максимальное количество мест на складе
    private _capacity: number = 0;
    //Занятые места на складе
    private _cells: Array<Cell> = [];
    //Список ресурсов, которые могут прийти на склад
    private _resources: Array<ResourceDescription>;
    //Список плохих факторов, которые могут возникнуть
    private _badFactors: Array<BadFactorDescription>;
    private _sort: ICellSortStrategy;


    constructor(resources: Array<ResourceDescription>, badFactors: Array<BadFactorDescription>) {
        super();
        this._resources = resources;
        this._badFactors = badFactors;
        for (let i = 0; i < this._capacity; ++i) {
            this._cells.push(new CellBuilder().build());
        }
        this._sort = new NoSortStrategy();
    }

    //Вычисляет арендную плату за хранение ресурса
    private cellRent(cell: Cell) {
        return Math.round(
            cell.resource.description.rent * cell.storeDays *
            cell.resource.quality / cell.resource.description.quality);
    }

    //Вычисляет штраф за полную порчу ресурса
    private cellPenalty(cell: Cell) {
        return Math.round(
            cell.resource.description.rent * cell.storeDays / 2);
    }

    //обработка существующих мест
    private processCells() {
        let cellsToRemove: Array<number> = [];
        let i = 0;
        for (let cell of this._cells) {
            if (cell.resource !== null) {
                if (cell.badFactor) {
                    cell.badFactor.apply(cell);
                    if (cell.resource.quality <= 0) {
                        cellsToRemove.push(i);
                        this.notify('cell-resource-destroyed', {cell: cell, penalty: this.cellPenalty(cell), i: i});
                        continue;
                    }
                }
                cell.restStoreDays -= 1;
                if (cell.restStoreDays <= 0) {
                    cellsToRemove.push(i);
                    this.notify('cell-rent', {cell: cell, rent: this.cellRent(cell)});
                }
            }
            ++i;
        }
        for (let idx of cellsToRemove) {
            ResourcePool.getInstance().release(this._cells[idx].resource);
            this._cells[idx] = new CellBuilder().setResists(this._cells[idx].resists).build();
        }
        this._cells = this._sort.sort(this._cells);
    }

    //распространение плохих факторов
    private spreadBadFactors() {
        let i = 0;
        for (let cell of this._cells) {
            if (cell.resource !== null) {
                for (let factor of this._badFactors) {
                    //вероятность появиться
                    if (!cell.badFactor &&
                        factor.canAffectTo(cell.resource) &&
                        Math.random() < 0.2) {
                        cell.badFactor = new BadFactor(factor);
                        this.notify('bad-factor-spread', {cell: cell, i: i});
                    }
                }
            }
            ++i;
        }
    }

    //получить индекс пустого места
    private getEmptyIndex() {
        let i = 0;
        for (let cell of this._cells) {
            if (cell.resource === null) {
                return i;
            }
            ++i;
        }
    }

    //поступление новых ресурсов
    private processNewCells() {
        let restCellCount = this._capacity - this.busyCells;
        for (let i = 0; i < restCellCount; ++i) {
            //вероятность нового заказа
            if (Math.random() < 0.15) {
                let randomResource = this._resources[Math.floor(Math.random() * this._resources.length)];
                let storeDays = Math.floor(Math.random() * 15) + 1;
                let resource = ResourcePool.getInstance().acquire();
                resource.description = randomResource;
                let cell = new CellBuilder()
                    .setResource(resource)
                    .setStoreDays(storeDays)
                    .setResists(this._cells[this.getEmptyIndex()].resists)
                    .build();
                this._cells[this.getEmptyIndex()] = cell;
                this.notify('new-cell', {cell: cell});
            }
        }
    }

    public addCell(cell: Cell): void {
        this._capacity += 1;
        this._cells.push(cell);
    }

    //Смоделировать события, прошедшие за один день
    public processDay() {
        this.processCells();
        this.spreadBadFactors();
        this.processNewCells();
    }

    public increaseCapacity(type: CellType) {
        this._capacity += 1;
        let cellBuilder = new CellBuilder();
        switch (type) {
            case CellType.Antibug:
                cellBuilder.makeAntiBug();
                break;
            case CellType.Antifire:
                cellBuilder.makeAntiFire();
                break;
        }
        this._cells.push(cellBuilder.build());
    }

    //Возвращает массив занятых ячеек склада
    get cells(): Array<Cell> {
        return this._cells;
    }

    //Возвращает стоимость увеличения вместимости склада на одно место
    get cellCost(): number {
        return this._capacity * 300;
    }

    //Возвращает максимальное количество мест на складе
    get capacity(): number {
        return this._capacity;
    }

    //Возвращает количество занятых мест на складе
    get busyCells(): number {
        return this._cells.filter((cell) => cell.resource != null).length;
    }

    //Возвращает номера занятых мест, в которых есть плохой фактор
    get corruptedCells(): Array<number> {
        let i = 0;
        let corrupted: Array<number> = [];
        for (let cell of this.cells) {
            if (cell.badFactor) {
                corrupted.push(i);
            }
            ++i;
        }
        return corrupted;
    }

    public clone(): Warehouse {
        let w = new Warehouse(this._resources, this._badFactors);
        w._capacity = this._capacity;
        w._cells = this._cells.map(c => c.clone());
        w.evs = this.evs;
        w._sort = this._sort;
        return w;
    }

    set sort(value: ICellSortStrategy) {
        this._sort = value;
        this._cells = value.sort(this._cells);
    }
}


export interface ICellSortStrategy {
    sort(cells: Array<Cell>): Array<Cell>;
}

export class DamagedFirstStrategy implements ICellSortStrategy{
    sort(cells: Array<Cell>): Array<Cell> {
        return cells.sort((a,b) => {
            if(a.badFactor != null){
                if(b.badFactor == null)
                    return -1;
                if(b.resource != null){
                    if(a.resource != null)
                        return a.restStoreDays - b.restStoreDays;
                    return 1;
                }
                if(a.resource != null)
                    return -1;
                return 0;
            }
            if(b.badFactor != null)
                return 1;
            if(b.resource != null){
                if(a.resource != null)
                    return a.restStoreDays - b.restStoreDays;
                return 1;
            }
            if(a.resource != null)
                return -1;
            return 0;
        });
    }
}

export class GoodFirstStrategy implements ICellSortStrategy{
    sort(cells: Array<Cell>): Array<Cell> {
        return cells.sort((a,b) => {
            if(a.badFactor == null){
                if(b.badFactor != null)
                    return -1;
                if(b.resource != null){
                    if(a.resource != null)
                        return 0;
                    return 1;
                }
                if(a.resource != null)
                    return -1;
                return 0;
            }
            if(b.badFactor == null)
                return 1;
            if(b.resource != null){
                if(a.resource != null)
                    return 0;
                return 1;
            }
            if(a.resource != null)
                return -1;
            return 0;
        });
    }
}

export class NoSortStrategy implements ICellSortStrategy{
    sort(cells: Array<Cell>): Array<Cell> {
        return cells;
    }
}