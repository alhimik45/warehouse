import {Cell} from "./Cell";
import {BadFactorDescription} from "./BadFactorDescription";
import {BadFactor} from "./BadFactor";
import {ResourceDescription} from "./ResourceDescription";
import {ResourcePool} from "./ResourcePool";
import {CellType} from "./CellType";
import {CellBuilder} from "./CellBuilder";

import asEvented = require('./asevented.min.js');

//Склад
export class Warehouse implements IEventEmitter {
    //Максимальное количество мест на складе
    private _capacity: number = 0;
    //Занятые места на складе
    private _cells: Array<Cell> = [];
    //Список ресурсов, которые могут прийти на склад
    private _resources: Array<ResourceDescription>;
    //Список плохих факторов, которые могут возникнуть
    private _badFactors: Array<BadFactorDescription>;


    constructor(resources: Array<ResourceDescription>, badFactors: Array<BadFactorDescription>) {
        this._resources = resources;
        this._badFactors = badFactors;
        for (let i = 0; i < this._capacity; ++i) {
            this._cells.push(new CellBuilder().build());
        }
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
                    this.emit('cell-resource-damaged', cell);
                    if (cell.resource.quality <= 0) {
                        cellsToRemove.push(i);
                        this.emit('cell-resource-destroyed', cell, this.cellPenalty(cell), i);
                        continue;
                    }
                }
                cell.restStoreDays -= 1;
                if (cell.restStoreDays <= 0) {
                    cellsToRemove.push(i);
                    this.emit('cell-rent', cell, this.cellRent(cell));
                }
            }
            ++i;
        }
        for (let idx of cellsToRemove) {
            ResourcePool.getInstance().release(this._cells[idx].resource);
            this._cells[idx] = new CellBuilder().setResists(this._cells[idx].resists).build();
        }
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
                        this.emit('bad-factor-spread', cell, i);
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
                this.emit('new-cell', cell);
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

    //для asEvented
    call: (proto: any) => void;
    on: (event: string, listener: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
}
//noinspection TypeScriptUnresolvedFunction
asEvented.call(Warehouse.prototype);
