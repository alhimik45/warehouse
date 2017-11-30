import {Cell} from "./Cell";
import {Resource} from "./Resource";
import {BadFactorDescription} from "./BadFactorDescription";
import {GameLogicFacade} from "./GameLogicFacade";

export class CellBuilder {
    //Ресурс, хранящийся в данном месте склада
    private _resource: Resource;
    //Время хранения ресурса
    private _storeDays: number;
    private _resists: Array<BadFactorDescription>;

    constructor() {
        this._resource = null;
        this._storeDays = 0;
        this._resists = [];
    }

    public setResource(resource: Resource): CellBuilder {
        this._resource = resource;
        return this;
    }

    public setStoreDays(days: number): CellBuilder {
        this._storeDays = days;
        return this;
    }

    public setResists(resists: Array<BadFactorDescription>): CellBuilder {
        this._resists = resists;
        return this;
    }

    public makeAntiFire(): CellBuilder {
        this._resists = GameLogicFacade.getInstance().getBadFires();
        return this;
    }

    public makeAntiBug(): CellBuilder {
        this._resists = GameLogicFacade.getInstance().getBadBugs();
        return this;
    }

    public build(): Cell {
        return new Cell(this._resource, this._storeDays, this._resists)
    }
}