import {Warehouse} from "./Warehouse";
import {ProtectorManager} from "./ProtectorManager";
import {BadFactorManager} from "./BadFactorManager";
import {ResourceManager} from "./ResourceManager";
import {IProtector} from "./IProtector";
import {ResourceProtectorAdapter} from "./ResourceProtectorAdapter";
import {ProtectorTemplateData} from "./ProtectorTemplateData";
import {InformationTemplateData} from "./InformationTemplateData";
import {Cell} from "./Cell";

export class GameLogicFacade {
    private static _instance: GameLogicFacade;
    public onCellRent: (cell: Cell, rent: number) => void;
    public onNewResource: (cell: Cell) => void;
    public onBadFactorSpread: (cell: Cell, i: number) => void;
    public onCellResourceDestroyed: (cell: Cell, penalty: number, i: number) => void;
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

    private allProtectors(): Array<IProtector> {
        return this._protectorManager.protectors.slice().concat(this._warehouse.cells.filter(c => c.resource).map(c => new ResourceProtectorAdapter(c.resource)));
    }

    public static getInstance(): GameLogicFacade {
        if (!GameLogicFacade._instance) {
            GameLogicFacade._instance = new GameLogicFacade();
        }
        return GameLogicFacade._instance;
    }

    public showEntities(){

    }

    public startGame(): void {
        this._money = 6666;
        this._days = 0;
        this._warehouse = new Warehouse(this._resourceManager.resources,
            this._badFactorManager.badFactors);

        this._warehouse.on('cell-rent', (cell: Cell, rent: number) => {
            this._money += rent;
            this.onCellRent && this.onCellRent(cell, rent);
        });
        this._warehouse.on('new-cell', (cell: Cell) => {
            this.onNewResource && this.onNewResource(cell);
        });
        this._warehouse.on('bad-factor-spread', (cell: Cell, i: number) => {
            this.onBadFactorSpread && this.onBadFactorSpread(cell, i);
        });
        this._warehouse.on('cell-resource-destroyed', (cell: Cell, penalty: number, i: number) => {
            //получаем штраф
            this._money -= penalty;
            this.onCellResourceDestroyed && this.onCellResourceDestroyed(cell, penalty, i)
        });
    }

    public nextDay(): void {
        this._warehouse.processDay();
        this._days += 1;
    }

    public increaseWarehouseCapacity(): boolean {
        if (this._money >= this._warehouse.cellCost) {
            this._money -= this._warehouse.cellCost;
            this._warehouse.capacity += 1;
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
}