import {Warehouse} from "./Warehouse";
import {ProtectorManager} from "./ProtectorManager";
import {BadFactorManager} from "./BadFactorManager";
import {ResourceManager} from "./ResourceManager";
import {IProtector} from "./IProtector";
import {ResourceProtectorAdapter} from "./ResourceProtectorAdapter";
import {ProtectorTemplateData} from "./ProtectorTemplateData";
import {InformationTemplateData} from "./InformationTemplateData";
import {Cell} from "./Cell";
import {CellType} from "./CellType";
import {selectIndexes} from "./util";
import {BadFactorDescription} from "./BadFactorDescription";
import {Observer, WrapObserver} from "./Subject";
import {Memento, State} from "./Memento";

export class GameLogicFacade {
    private static _instance: GameLogicFacade;
    public onCellRent: Observer;
    public onNewResource: Observer;
    public onBadFactorSpread: Observer;
    public onCellResourceDestroyed: Observer;
    //объект, управляющий списком ресурсов
    private _resourceManager: ResourceManager;
    //объект, управляющий списком плохих факторов
    private _badFactorManager: BadFactorManager;
    //объект, управляющий списком средств защиты
    private _protectorManager: ProtectorManager;
    //объект склада
    private _warehouse: Warehouse;
    //деньги кладовщика
    private _money: number;
    //сколько дней работает кладовщик
    private _days: number;

    private constructor() {
        this._resourceManager = new ResourceManager;
        this._badFactorManager = new BadFactorManager(this._resourceManager.resources);
        this._protectorManager = new ProtectorManager(this._badFactorManager.badFactors);
    }

    public allProtectors(): Array<IProtector> {
        return this._protectorManager.protectors.slice().concat(this._warehouse.cells.filter(c => c.resource).map(c => new ResourceProtectorAdapter(c.resource)));
    }

    public static getInstance(): GameLogicFacade {
        if (!GameLogicFacade._instance) {
            GameLogicFacade._instance = new GameLogicFacade();
        }
        return GameLogicFacade._instance;
    }

    public showEntities() {

    }

    public copyCell(cellIdx: number): void {
        this._warehouse.addCell(this._warehouse.cells[cellIdx].clone())
    }

    public startGame(): void {
        this._money = 999999;
        this._days = 0;
        this._warehouse = new Warehouse(this._resourceManager.resources,
            this._badFactorManager.badFactors);

        this._warehouse.attach('cell-rent', new WrapObserver(this.onCellRent, (data: any) => {
            this._money += data.rent;
        }));
        this._warehouse.attach('new-cell', this.onNewResource);
        this._warehouse.attach('bad-factor-spread', this.onBadFactorSpread);
        this._warehouse.attach('cell-resource-destroyed', new WrapObserver(this.onCellResourceDestroyed, (data: any) => {
            //получаем штраф
            this._money -= data.penalty;
        }));
    }

    public nextDay(): void {
        this._warehouse.processDay();
        this._days += 1;
    }

    public increaseWarehouseCapacity(type: CellType): boolean {
        if (this._money >= this._warehouse.cellCost) {
            this._money -= this._warehouse.cellCost;
            this._warehouse.increaseCapacity(type);
            return true;
        }
        return false;
    }

    public applyProtector(cellIdx: number, protectorIdx: number) {
        let protector = this.allProtectors()[protectorIdx];
        protector.apply(this._warehouse.cells[cellIdx]);
        this._money -= protector.cost;
    }

    public getNewCellCost(): number {
        return this._warehouse.cellCost;
    }

    public isLose(): boolean {
        return this._money < 0;
    }

    public getCellProtectors(cellIdx: number): Array<ProtectorTemplateData> {
        let selectedCell = this._warehouse.cells[cellIdx];
        let tplProtectors: Array<ProtectorTemplateData> = [];
        if (selectedCell.badFactor) {
            let i = 0;
            for (let protector of this.allProtectors()) {
                if (protector.canApply(selectedCell)) {
                    tplProtectors.push(new ProtectorTemplateData(
                        this._money >= protector.cost,
                        protector,
                        i
                    ));
                }
                ++i;
            }
            return tplProtectors;
        } else {
            return null;
        }
    }

    public getInfo(): InformationTemplateData {
        return new InformationTemplateData(
            this._money,
            this._warehouse.busyCells,
            this._warehouse.capacity,
            this._days,
            this._warehouse.corruptedCells
        )
    }

    public getCells(): Array<Cell> {
        return this._warehouse.cells;
    }

    public getBadFires(): Array<BadFactorDescription> {
        return selectIndexes(this._badFactorManager.badFactors, [2]);
    }

    public getBadBugs(): Array<BadFactorDescription> {
        return selectIndexes(this._badFactorManager.badFactors, [0, 1]);
    }

    public createMemento(): Memento {
        let s = new State(this._days, this._money, this._warehouse);
        return new Memento().setState(s);
    }

    public resetState(m: Memento) {
        let s = m.getState();
        this._days = s.days;
        this._money = s.money;
        this._warehouse = s.warehouse.clone();
    }
}