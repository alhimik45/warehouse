import {Warehouse} from "./Warehouse";

export class Memento {
    private _s: State;

    setState(s: State): Memento {
        this._s = s;
        return this;
    }

    getState(): State {
        return this._s;
    }
}

export class State {
    public days: number;
    public money: number;
    public warehouse: Warehouse;


    constructor(days: number, money: number, warehouse: Warehouse) {
        this.days = days;
        this.money = money;
        this.warehouse = warehouse.clone();
    }
}